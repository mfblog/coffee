import { useState, useCallback, useEffect, useRef } from "react";
import { Method, equipmentList, commonMethods, CustomEquipment } from "@/lib/core/config";
import { Storage } from "@/lib/core/storage";
import { BrewingNoteData, CoffeeBean } from "@/types/app";
import {
	loadCustomMethods,
	saveCustomMethod as apiSaveCustomMethod,
	deleteCustomMethod as apiDeleteCustomMethod,
} from "@/lib/managers/customMethods";
import { loadCustomEquipments } from "@/lib/managers/customEquipments";
import { CoffeeBeanManager } from "@/lib/managers/coffeeBeanManager";
import { NavigationOptions, STEP_RULES } from "../brewing/constants";
import { updateParameterInfo } from "../brewing/parameters";
import { getStringState, saveStringState } from "@/lib/core/statePersistence";
import { getMainTabPreference, saveMainTabPreference } from "@/lib/navigation/navigationCache";

// 器具选择缓存
const MODULE_NAME = 'brewing-equipment';
const DEFAULT_EQUIPMENT = 'V60';

export const getSelectedEquipmentPreference = (): string => {
    return getStringState(MODULE_NAME, 'selectedEquipment', DEFAULT_EQUIPMENT);
};

export const saveSelectedEquipmentPreference = (equipmentId: string): void => {
    saveStringState(MODULE_NAME, 'selectedEquipment', equipmentId);
    window.dispatchEvent(new CustomEvent('equipmentCacheChanged', {
        detail: { equipmentId }
    }));
};

// 定义标签类型
export type TabType = "咖啡豆" | "方案" | "注水" | "记录";

// 添加新的主导航类型
export type MainTabType = "冲煮" | "笔记" | "咖啡豆";

// 修改冲煮步骤类型
export type BrewingStep =
	| "coffeeBean"
	| "method"
	| "brewing"
	| "notes";

export interface Step {
	title: string;
	description?: string;
	methodId?: string;
	isCustom?: boolean;
	items?: string[];
	note?: string;
	time?: number;
	pourTime?: number;
	water?: string;
	detail?: string;
	pourType?: string;
	valveStatus?: "open" | "closed";
	originalIndex?: number;
	type?: "pour" | "wait";
	startTime?: number;
	endTime?: number;
	isCommonMethod?: boolean;
	methodIndex?: number;
}

export interface Content {
	咖啡豆: {
		steps: Step[];
	};
	方案: {
		steps: Step[];
		type: "common" | "custom";
	};
	注水: {
		steps: Step[];
	};
	记录: {
		steps: Step[];
	};
}

export function useBrewingState(initialBrewingStep?: BrewingStep) {
	// 添加主导航状态 - 从缓存中加载上次选择的主标签页
	const [activeMainTab, setActiveMainTab] = useState<MainTabType>(() => {
		// 在客户端运行时从缓存加载，服务器端渲染时使用默认值
		if (typeof window !== 'undefined') {
			return getMainTabPreference();
		}
		return "冲煮";
	});
	// 修改默认步骤为方案或传入的参数
	const [activeBrewingStep, setActiveBrewingStep] = useState<BrewingStep>(
		initialBrewingStep || "method"
	);
	const [activeTab, setActiveTab] = useState<TabType>(
		initialBrewingStep === "coffeeBean" ? "咖啡豆" : "方案"
	);

	// 添加咖啡豆选择状态
	const [selectedCoffeeBean, setSelectedCoffeeBean] = useState<string | null>(
		null
	);
	const [selectedCoffeeBeanData, setSelectedCoffeeBeanData] =
		useState<CoffeeBean | null>(null);

	const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
		getSelectedEquipmentPreference()
	);
	const [selectedMethod, setSelectedMethod] = useState<Method | null>(null);
	const [currentBrewingMethod, setCurrentBrewingMethod] =
		useState<Method | null>(null);

	const [isTimerRunning, setIsTimerRunning] = useState(false);
	const [currentStage, setCurrentStage] = useState(-1);
	const [showHistory, setShowHistory] = useState(false);
	const [showComplete, setShowComplete] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);

	const [methodType, setMethodType] = useState<"common" | "custom">("common");

	const [countdownTime, setCountdownTime] = useState<number | null>(null);
	const [isPourVisualizerPreloaded] = useState(false);
	const [customMethods, setCustomMethods] = useState<
		Record<string, Method[]>
	>({});

	const [showCustomForm, setShowCustomForm] = useState(false);
	const [editingMethod, setEditingMethod] = useState<Method | undefined>(
		undefined
	);
	// 添加一个新的状态来跟踪每个卡片的菜单状态
	const [actionMenuStates, setActionMenuStates] = useState<
		Record<string, boolean>
	>({});
	// 添加导入方案表单状态
	const [showImportForm, setShowImportForm] = useState(false);
	// 添加笔记保存状态追踪
	const [isNoteSaved, setIsNoteSaved] = useState(false);

	// 在PourOverRecipes组件的开头添加前一个标签的引用
	const prevMainTabRef = useRef<MainTabType | null>(null);

	// 添加自定义器具状态
	const [customEquipments, setCustomEquipments] = useState<CustomEquipment[]>([]);

	// 加载自定义器具
	useEffect(() => {
		const loadEquipments = async () => {
			try {
				const equipments = await loadCustomEquipments();
				setCustomEquipments(equipments);
			} catch (error) {
				console.error('加载自定义器具失败:', error);
			}
		};

		loadEquipments();
	}, []);

	// 监听器具缓存变化，实现跨组件同步
	useEffect(() => {
		const handleEquipmentCacheChange = (e: CustomEvent<{ equipmentId: string }>) => {
			const newEquipment = e.detail.equipmentId;
			// 只有当缓存中的值与当前状态不同时才更新
			if (newEquipment !== selectedEquipment) {
				setSelectedEquipment(newEquipment);
			}
		};

		// 监听自定义事件
		window.addEventListener('equipmentCacheChanged', handleEquipmentCacheChange as EventListener);

		return () => {
			window.removeEventListener('equipmentCacheChanged', handleEquipmentCacheChange as EventListener);
		};
	}, [selectedEquipment]);

	// 简化的前置条件检查
	const checkPrerequisites = useCallback(
		(step: BrewingStep): boolean => {
			switch (step) {
				case "brewing":
					return !!selectedMethod;
				case "notes":
					return showComplete;
				default:
					return true;
			}
		},
		[selectedMethod, showComplete]
	);



	// 简化的步骤导航函数
	const navigateToStep = useCallback(
		(step: BrewingStep, options?: NavigationOptions) => {
			const { force = false } = options || {};

			// 切换到冲煮标签
			if (activeMainTab !== "冲煮") {
				saveMainTabPreference("冲煮");
				setActiveMainTab("冲煮");
				setShowHistory(false);
				setTimeout(() => navigateToStep(step, options), 0);
				return false;
			}

			// 检查计时器状态
			if (isTimerRunning && !showComplete && !force) {
				return false;
			}

			// 检查前置条件
			if (!force && !checkPrerequisites(step)) {
				return false;
			}

			// 设置步骤和标签
			setActiveBrewingStep(step);
			setActiveTab(STEP_RULES.tabMapping[step]);

			// 更新参数栏
			updateParameterInfo(
				step,
				selectedEquipment,
				selectedMethod,
				equipmentList,
				customEquipments
			);

			return true;
		},
		[
			activeMainTab,
			isTimerRunning,
			showComplete,
			checkPrerequisites,
			selectedEquipment,
			selectedMethod,
			customEquipments,
		]
	);

	// 简化的重置函数
	const resetBrewingState = useCallback(
		(preserveMethod = false) => {
			if (preserveMethod && selectedMethod) {
				navigateToStep("brewing");
			} else {
				const cachedEquipment = getSelectedEquipmentPreference();
				if (cachedEquipment) {
					setSelectedEquipment(cachedEquipment);
				}
				navigateToStep("method");
			}
		},
		[navigateToStep, selectedMethod]
	);

	// 简化的器具选择处理
	const handleEquipmentSelect = useCallback(
		(equipmentName: string) => {
			// 切换到冲煮标签
			if (activeMainTab !== "冲煮") {
				saveMainTabPreference("冲煮");
				setActiveMainTab("冲煮");
				setShowHistory(false);
				setTimeout(() => handleEquipmentSelect(equipmentName), 0);
				return equipmentName;
			}

			// 如果冲煮已完成，重置状态
			if (showComplete) {
				resetBrewingState(true);
				window.dispatchEvent(new CustomEvent("brewing:reset"));
			}

			// 设置器具
			const equipment = equipmentList.find((e) => e.name === equipmentName)?.id || equipmentName;
			setSelectedEquipment(equipment);
			saveSelectedEquipmentPreference(equipment);

			// 重置方案状态
			setSelectedMethod(null);
			setCurrentBrewingMethod(null);
			setMethodType('common');

			// 导航到方案步骤
			setActiveTab("方案");
			setActiveBrewingStep("method");

			return equipmentName;
		},
		[activeMainTab, showComplete, resetBrewingState]
	);

	// 加载自定义方案
	useEffect(() => {
		const loadMethods = async () => {
			try {
				const methods = await loadCustomMethods();
				setCustomMethods(methods);
			} catch (error) {
				console.error('加载方案失败:', error);
				// 添加重试机制，确保方案加载成功
				setTimeout(loadMethods, 1000);
			}
		};

		loadMethods();
	}, []);

	// 简化的保存笔记函数
	const handleSaveNote = useCallback(
		async (data: BrewingNoteData) => {
			try {
				const notesStr = await Storage.get("brewingNotes");
				const notes = notesStr ? JSON.parse(notesStr) : [];

				const stages = selectedMethod?.params.stages || [];
				const newNote = {
					...data,
					id: Date.now().toString(),
					timestamp: Date.now(),
					stages,
				};

				const updatedNotes = [newNote, ...notes];
				await Storage.set("brewingNotes", JSON.stringify(updatedNotes));

				// 扣减咖啡豆用量
				if (selectedCoffeeBean && currentBrewingMethod?.params.coffee) {
					const match = currentBrewingMethod.params.coffee.match(/(\d+\.?\d*)/);
					if (match) {
						const coffeeAmount = parseFloat(match[1]);
						if (!isNaN(coffeeAmount) && coffeeAmount > 0) {
							await CoffeeBeanManager.updateBeanRemaining(selectedCoffeeBean, coffeeAmount);
						}
					}
				}

				// 跳转到笔记页面
				setActiveMainTab("笔记");
				setShowHistory(true);
				resetBrewingState();
			} catch (_error) {
				alert("保存笔记时出错，请重试");
			}
		},
		[selectedMethod, selectedCoffeeBean, currentBrewingMethod, resetBrewingState]
	);

	// 简化的自定义方案保存
	const handleSaveCustomMethod = useCallback(
		async (method: Method) => {
			try {
				if (!selectedEquipment) throw new Error("未选择设备");

				await apiSaveCustomMethod(method, selectedEquipment, customMethods, editingMethod);
				const methods = await loadCustomMethods();
				setCustomMethods(methods);

				const savedMethod = methods[selectedEquipment]?.find(m => m.name === method.name);
				setSelectedMethod(savedMethod || method);
				setShowCustomForm(false);
				setEditingMethod(undefined);
			} catch (error) {
				console.error("保存方案失败:", error);
				alert("保存方案失败，请重试");
			}
		},
		[selectedEquipment, customMethods, editingMethod]
	);

	// 编辑自定义方案
	const handleEditCustomMethod = useCallback((method: Method) => {
		setEditingMethod(method);
		setShowCustomForm(true);
	}, []);

	// 删除自定义方案
	const handleDeleteCustomMethod = useCallback(
		async (method: Method) => {
			if (!window.confirm(`确定要删除方案"${method.name}"吗？`)) return;

			try {
				await apiDeleteCustomMethod(method, selectedEquipment, customMethods);
				const methods = await loadCustomMethods();
				setCustomMethods(methods);

				if (selectedMethod?.id === method.id) {
					setSelectedMethod(null);
				}
			} catch (error) {
				console.error("删除方案失败:", error);
				alert("删除方案失败，请重试");
			}
		},
		[selectedEquipment, customMethods, selectedMethod]
	);

	// 简化咖啡豆选择处理
	const handleCoffeeBeanSelect = useCallback(
		(beanId: string | null, bean: CoffeeBean | null) => {
			setSelectedCoffeeBean(beanId);
			setSelectedCoffeeBeanData(bean);
			setActiveBrewingStep("method");
			setActiveTab("方案");
		},
		[]
	);

	// 简化的content状态
	const [content, setContent] = useState<Content>({
		咖啡豆: { steps: [] },
		方案: { steps: [], type: 'common' },
		注水: { steps: [] },
		记录: { steps: [] },
	});

	// 简化的content更新
	useEffect(() => {
		const getMethods = () => {
			if (!selectedEquipment) return [];
			const methods = methodType === "common"
				? commonMethods[selectedEquipment] || []
				: customMethods[selectedEquipment] || [];
			return methods.map(method => ({ title: method.name, methodId: method.id }));
		};

		const getStages = () => {
			if (!currentBrewingMethod) return [];
			return currentBrewingMethod.params.stages.map((stage, index) => ({
				title: stage.label,
				time: stage.time,
				pourTime: stage.pourTime,
				water: stage.water,
				detail: stage.detail,
				pourType: stage.pourType,
				valveStatus: stage.valveStatus,
				originalIndex: index,
			}));
		};

		setContent({
			咖啡豆: { steps: [] },
			方案: { steps: getMethods(), type: methodType },
			注水: { steps: getStages() },
			记录: { steps: [] },
		});
	}, [selectedEquipment, methodType, commonMethods, customMethods, currentBrewingMethod]);

	return {
		// 主要状态
		activeMainTab,
		setActiveMainTab,
		activeBrewingStep,
		setActiveBrewingStep,
		activeTab,
		setActiveTab,

		// 选择状态
		selectedEquipment,
		setSelectedEquipment,
		selectedMethod,
		setSelectedMethod,
		currentBrewingMethod,
		setCurrentBrewingMethod,
		selectedCoffeeBean,
		setSelectedCoffeeBean,
		selectedCoffeeBeanData,
		setSelectedCoffeeBeanData,

		// 计时状态
		isTimerRunning,
		setIsTimerRunning,
		currentStage,
		setCurrentStage,
		showComplete,
		setShowComplete,
		currentTime,
		setCurrentTime,
		countdownTime,
		setCountdownTime,

		// 界面状态
		showHistory,
		setShowHistory,
		methodType,
		setMethodType,
		showCustomForm,
		setShowCustomForm,
		editingMethod,
		setEditingMethod,
		actionMenuStates,
		setActionMenuStates,
		showImportForm,
		setShowImportForm,
		isNoteSaved,
		setIsNoteSaved,

		// 数据
		customMethods,
		setCustomMethods,
		customEquipments,
		setCustomEquipments,
		content,
		setContent,
		prevMainTabRef,
		isPourVisualizerPreloaded,

		// 处理函数
		resetBrewingState,
		handleEquipmentSelect,
		handleCoffeeBeanSelect,
		handleSaveNote,
		handleSaveCustomMethod,
		handleEditCustomMethod,
		handleDeleteCustomMethod,
		navigateToStep,
	};
}
