import React from 'react'
import { isBeanEmpty } from '../../globalCache'
import { StatsData, AnimationStyles } from './types'
import { formatNumber } from './utils'
import { StatCategory, StatItem, renderStatsRows } from './StatComponents'
import { useTranslations } from 'next-intl'

interface StatsCategoriesProps {
    stats: StatsData
    beans: any[]
    todayConsumption: number
    todayCost: number
    styles: AnimationStyles
}

const StatsCategories: React.FC<StatsCategoriesProps> = ({
    stats,
    beans,
    todayConsumption,
    todayCost,
    styles
}) => {
    const t = useTranslations()

    // 为风味标签创建特殊的渲染函数
    const renderFlavorStatsRows = (dataArr: [string, number][], unit?: string) => {
        const defaultUnit = unit || 'pcs';

        return dataArr
            .sort((a, b) => b[1] - a[1])
            .map(([key, value]) => (
                <StatItem
                    key={key}
                    label={key}
                    value={`${value}`}
                    unit={defaultUnit}
                />
            ));
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-8">
                {/* 编号01 - 基本数据 */}
                <StatCategory
                    number={1}
                    title={t('nav.stats.categories.basicData')}
                    animStyle={styles.statsAnimStyle(0)}
                >
                    <StatItem label={t('nav.stats.labels.totalBeans')} value={`${stats.totalBeans}`} unit={t('nav.units.pieces')} />
                    <StatItem label={t('nav.stats.labels.activeBeans')} value={`${stats.activeBeans}`} unit={t('nav.units.pieces')} />
                    <StatItem label={t('nav.stats.labels.emptyBeans')} value={`${stats.emptyBeans}`} unit={t('nav.units.pieces')} />
                </StatCategory>

                {/* 编号02 - 库存信息 */}
                <StatCategory
                    number={2}
                    title={t('nav.stats.categories.inventory')}
                    animStyle={styles.statsAnimStyle(0)}
                >
                    <StatItem label={t('nav.stats.labels.totalWeight')} value={`${formatNumber(stats.totalWeight)}`} unit={t('nav.units.grams')} />
                    <StatItem label={t('nav.stats.labels.remainingWeight')} value={`${formatNumber(stats.remainingWeight)}`} unit={t('nav.units.grams')} />
                    <StatItem label={t('nav.stats.labels.consumedWeight')} value={`${formatNumber(stats.consumedWeight)}`} unit={t('nav.units.grams')} />
                    <StatItem label={t('nav.stats.labels.consumptionRatio')} value={`${stats.totalWeight > 0 ? formatNumber((stats.consumedWeight / stats.totalWeight) * 100) : '0'}`} unit="%" />
                    <StatItem label={t('nav.stats.labels.todayConsumption')} value={`${formatNumber(todayConsumption)}`} unit={t('nav.units.grams')} />
                </StatCategory>

                {/* 编号03 - 费用数据 */}
                <StatCategory
                    number={3}
                    title={t('nav.stats.categories.costData')}
                    animStyle={styles.statsAnimStyle(0)}
                >
                    <StatItem label={t('nav.stats.labels.totalCost')} value={`${formatNumber(stats.totalCost)}`} unit={t('nav.units.currency')} />
                    <StatItem label={t('nav.stats.labels.remainingCoffeeValue')} value={`${formatNumber(stats.remainingWeight * stats.averageGramPrice)}`} unit={t('nav.units.currency')} />
                    <StatItem label={t('nav.stats.labels.consumedCoffeeValue')} value={`${formatNumber(stats.consumedWeight * stats.averageGramPrice)}`} unit={t('nav.units.currency')} />
                    <StatItem label={t('nav.stats.labels.averageBeanPrice')} value={`${formatNumber(stats.averageBeanPrice)}`} unit={t('nav.units.currency')} />
                    <StatItem label={t('nav.stats.labels.averageGramPrice')} value={`${formatNumber(stats.averageGramPrice)}`} unit={t('nav.units.pricePerGram')} />
                    <StatItem label={t('nav.stats.labels.todayCost')} value={`${formatNumber(todayCost)}`} unit={t('nav.units.currency')} />
                </StatCategory>
                
                {/* 编号04 - 豆子分类 */}
                <StatCategory
                    number={4}
                    title={t('nav.stats.categories.classification')}
                    animStyle={styles.statsAnimStyle(1)}
                >
                    <StatItem
                        label={t('nav.stats.labels.singleOrigin')}
                        value={(() => {
                            const total = beans.filter(bean => !bean.blendComponents || bean.blendComponents.length <= 1).length;
                            const active = beans.filter(bean => (!bean.blendComponents || bean.blendComponents.length <= 1) && !isBeanEmpty(bean)).length;
                            return total === 0 ? '0' : `${active}/${total}`;
                        })()}
                        unit={t('nav.units.pieces')}
                    />
                    <StatItem
                        label={t('nav.stats.labels.blend')}
                        value={(() => {
                            const total = beans.filter(bean => bean.blendComponents && bean.blendComponents.length > 1).length;
                            const active = beans.filter(bean => bean.blendComponents && bean.blendComponents.length > 1 && !isBeanEmpty(bean)).length;
                            return total === 0 ? '0' : `${active}/${total}`;
                        })()}
                        unit={t('nav.units.pieces')}
                    />
                    <StatItem
                        label={t('nav.filters.espressoBean')}
                        value={(() => {
                            const total = beans.filter(bean => bean.beanType === 'espresso').length;
                            const active = beans.filter(bean => bean.beanType === 'espresso' && !isBeanEmpty(bean)).length;
                            return total === 0 ? '0' : `${active}/${total}`;
                        })()}
                        unit={t('nav.units.pieces')}
                    />
                    <StatItem
                        label={t('nav.filters.filterBean')}
                        value={(() => {
                            const total = beans.filter(bean => bean.beanType === 'filter').length;
                            const active = beans.filter(bean => bean.beanType === 'filter' && !isBeanEmpty(bean)).length;
                            return total === 0 ? '0' : `${active}/${total}`;
                        })()}
                        unit={t('nav.units.pieces')}
                    />
                </StatCategory>
                
                {/* 编号05 - 赏味期状态 */}
                <StatCategory
                    number={5}
                    title={t('nav.stats.categories.flavorPeriod')}
                    animStyle={styles.statsAnimStyle(1)}
                >
                    <StatItem label={t('nav.stats.labels.inPeriod')} value={`${stats.flavorPeriodStatus.inPeriod}`} unit={t('nav.units.pieces')} />
                    <StatItem label={t('nav.stats.labels.beforePeriod')} value={`${stats.flavorPeriodStatus.beforePeriod}`} unit={t('nav.units.pieces')} />
                    <StatItem label={t('nav.stats.labels.afterPeriod')} value={`${stats.flavorPeriodStatus.afterPeriod}`} unit={t('nav.units.pieces')} />
                    {/* <StatItem label={t('nav.stats.labels.unknown')} value={`${stats.flavorPeriodStatus.unknown}`} unit={t('nav.units.pieces')} /> */}
                </StatCategory>

                {/* 编号06 - 烘焙度分布 */}
                <StatCategory
                    number={6}
                    title={t('nav.stats.categories.roastLevel')}
                    animStyle={styles.statsAnimStyle(2)}
                >
                    {renderStatsRows(Object.entries(stats.roastLevelCount), t('nav.units.pieces'))}
                </StatCategory>

                {/* 编号07 - 产地分布 */}
                <StatCategory
                    number={7}
                    title={t('nav.stats.categories.origin')}
                    animStyle={styles.statsAnimStyle(2)}
                >
                    {renderStatsRows(Object.entries(stats.originCount), t('nav.units.pieces'))}
                </StatCategory>

                {/* 编号08 - 处理法分布 */}
                <StatCategory
                    number={8}
                    title={t('nav.stats.categories.process')}
                    animStyle={styles.statsAnimStyle(3)}
                >
                    {renderStatsRows(Object.entries(stats.processCount), t('nav.units.pieces'))}
                </StatCategory>

                {/* 编号09 - 品种分布 */}
                <StatCategory
                    number={9}
                    title={t('nav.stats.categories.variety')}
                    animStyle={styles.statsAnimStyle(3)}
                >
                    {renderStatsRows(Object.entries(stats.varietyCount), t('nav.units.pieces'))}
                </StatCategory>

                {/* 编号10 - 风味标签分布 */}
                <StatCategory
                    number={10}
                    title={t('nav.stats.categories.flavor')}
                    animStyle={styles.statsAnimStyle(3)}
                >
                    {renderFlavorStatsRows(stats.topFlavors, t('nav.units.times'))}
                </StatCategory>

                {/* 编号11 - 意式咖啡统计 */}
                <StatCategory
                    number={11}
                    title={t('nav.stats.categories.espressoCoffee')}
                    animStyle={styles.statsAnimStyle(4)}
                >
                    <StatItem label={t('nav.stats.labels.espressoBeansTotal')} value={`${stats.espressoStats.totalBeans}`} unit={t('nav.units.pieces')} />
                    <StatItem label={t('nav.stats.labels.activeBeans')} value={`${stats.espressoStats.activeBeans}`} unit={t('nav.units.pieces')} />
                    <StatItem label={t('nav.stats.labels.totalWeight')} value={`${formatNumber(stats.espressoStats.totalWeight)}`} unit={t('nav.units.grams')} />
                    <StatItem label={t('nav.stats.labels.remainingWeight')} value={`${formatNumber(stats.espressoStats.remainingWeight)}`} unit={t('nav.units.grams')} />
                    <StatItem label={t('nav.stats.labels.consumedWeight')} value={`${formatNumber(stats.espressoStats.consumedWeight)}`} unit={t('nav.units.grams')} />
                    <StatItem label={t('nav.stats.labels.totalCost')} value={`${formatNumber(stats.espressoStats.totalCost)}`} unit={t('nav.units.currency')} />
                    <StatItem label={t('nav.stats.labels.averageBeanPrice')} value={`${formatNumber(stats.espressoStats.averageBeanPrice)}`} unit={t('nav.units.currency')} />
                    <StatItem label={t('nav.stats.labels.averageGramPrice')} value={`${formatNumber(stats.espressoStats.averageGramPrice)}`} unit={t('nav.units.pricePerGram')} />
                    <StatItem label={t('nav.stats.labels.todayConsumption')} value={`${formatNumber(stats.espressoStats.todayConsumption)}`} unit={t('nav.units.grams')} />
                    <StatItem label={t('nav.stats.labels.todayCost')} value={`${formatNumber(stats.espressoStats.todayCost)}`} unit={t('nav.units.currency')} />
                </StatCategory>

                {/* 编号12 - 手冲咖啡统计 */}
                <StatCategory
                    number={12}
                    title={t('nav.stats.categories.filterCoffee')}
                    animStyle={styles.statsAnimStyle(4)}
                >
                    <StatItem label={t('nav.stats.labels.filterBeansTotal')} value={`${stats.filterStats.totalBeans}`} unit={t('nav.units.pieces')} />
                    <StatItem label={t('nav.stats.labels.activeBeans')} value={`${stats.filterStats.activeBeans}`} unit={t('nav.units.pieces')} />
                    <StatItem label={t('nav.stats.labels.totalWeight')} value={`${formatNumber(stats.filterStats.totalWeight)}`} unit={t('nav.units.grams')} />
                    <StatItem label={t('nav.stats.labels.remainingWeight')} value={`${formatNumber(stats.filterStats.remainingWeight)}`} unit={t('nav.units.grams')} />
                    <StatItem label={t('nav.stats.labels.consumedWeight')} value={`${formatNumber(stats.filterStats.consumedWeight)}`} unit={t('nav.units.grams')} />
                    <StatItem label={t('nav.stats.labels.totalCost')} value={`${formatNumber(stats.filterStats.totalCost)}`} unit={t('nav.units.currency')} />
                    <StatItem label={t('nav.stats.labels.averageBeanPrice')} value={`${formatNumber(stats.filterStats.averageBeanPrice)}`} unit={t('nav.units.currency')} />
                    <StatItem label={t('nav.stats.labels.averageGramPrice')} value={`${formatNumber(stats.filterStats.averageGramPrice)}`} unit={t('nav.units.pricePerGram')} />
                    <StatItem label={t('nav.stats.labels.todayConsumption')} value={`${formatNumber(stats.filterStats.todayConsumption)}`} unit={t('nav.units.grams')} />
                    <StatItem label={t('nav.stats.labels.todayCost')} value={`${formatNumber(stats.filterStats.todayCost)}`} unit={t('nav.units.currency')} />
                </StatCategory>
            </div>
        </div>
    )
}

export default StatsCategories 