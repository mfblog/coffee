'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'

interface ImageBoundaryEditorProps {
    image: string;
    onSave: (processedImage: string) => void;
    onCancel: () => void;
}

const ImageBoundaryEditor: React.FC<ImageBoundaryEditorProps> = ({ 
    image, 
    onSave, 
    onCancel 
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawingRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [path, setPath] = useState<Array<{x: number, y: number}>>([]);
    const [imageSize, setImageSize] = useState<{width: number, height: number}>({width: 0, height: 0});
    const [drawingContext, setDrawingContext] = useState<CanvasRenderingContext2D | null>(null);
    
    // 初始化画布
    useEffect(() => {
        const img = document.createElement('img');
        img.onload = () => {
            if (canvasRef.current && drawingRef.current) {
                const canvas = canvasRef.current;
                const drawCanvas = drawingRef.current;
                
                // 设置更合理的画布尺寸 - 减小最大尺寸限制
                const maxWidth = 320; // 进一步减小尺寸
                const maxHeight = 320; // 进一步减小尺寸
                let width = img.width;
                let height = img.height;
                
                // 计算保持纵横比的尺寸
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = width * ratio;
                height = height * ratio;
                
                canvas.width = width;
                canvas.height = height;
                drawCanvas.width = width;
                drawCanvas.height = height;
                setImageSize({width, height});
                
                // 绘制原始图片
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                
                // 初始化绘图画布
                const drawCtx = drawCanvas.getContext('2d');
                if (drawCtx) {
                    drawCtx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
                    drawCtx.lineWidth = 2;
                    drawCtx.lineCap = 'round';
                    drawCtx.lineJoin = 'round';
                    setDrawingContext(drawCtx);
                }
            }
        };
        img.src = image;
    }, [image]);
    
    // 绘制路径
    const drawPath = useCallback(() => {
        if (!drawingContext || path.length === 0) return;
        
        drawingContext.clearRect(0, 0, imageSize.width, imageSize.height);
        drawingContext.beginPath();
        drawingContext.moveTo(path[0].x, path[0].y);
        
        for (let i = 1; i < path.length; i++) {
            drawingContext.lineTo(path[i].x, path[i].y);
        }
        
        // 如果路径长度超过2，连接回起点形成闭合路径
        if (path.length > 2) {
            drawingContext.lineTo(path[0].x, path[0].y);
        }
        
        drawingContext.stroke();
    }, [drawingContext, path, imageSize]);
    
    // 监听路径变化时重绘
    useEffect(() => {
        drawPath();
    }, [path, drawPath]);
    
    // 处理鼠标/触摸事件
    const handlePointerDown = (e: React.PointerEvent) => {
        if (!drawingRef.current) return;
        
        const rect = drawingRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setIsDrawing(true);
        setPath([{x, y}]);
        
        drawingRef.current.setPointerCapture(e.pointerId);
    };
    
    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDrawing || !drawingRef.current) return;
        
        const rect = drawingRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setPath(prev => [...prev, {x, y}]);
    };
    
    const handlePointerUp = (e: React.PointerEvent) => {
        if (drawingRef.current) {
            drawingRef.current.releasePointerCapture(e.pointerId);
        }
        setIsDrawing(false);
        
        // 闭合路径 - 如果有足够的点，添加起点作为终点
        if (path.length > 2) {
            setPath(prev => [...prev, prev[0]]);
        }
    };
    
    // 应用边界处理
    const applyBoundary = () => {
        if (!canvasRef.current || path.length < 3) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // 计算裁剪区域的边界 - 找出路径的最小和最大x、y坐标
        let minX = path[0].x;
        let minY = path[0].y;
        let maxX = path[0].x;
        let maxY = path[0].y;
        
        for (let i = 1; i < path.length; i++) {
            minX = Math.min(minX, path[i].x);
            minY = Math.min(minY, path[i].y);
            maxX = Math.max(maxX, path[i].x);
            maxY = Math.max(maxY, path[i].y);
        }
        
        // 边框宽度和边距设置
        const borderWidth = 10; // 增加边框宽度，从6改为10
        const padding = borderWidth + 5; // 额外边距，用于阴影
        
        // 调整裁剪区域以包含边框
        minX = Math.max(0, minX - padding);
        minY = Math.max(0, minY - padding);
        maxX = Math.min(canvas.width, maxX + padding);
        maxY = Math.min(canvas.height, maxY + padding);
        
        // 计算裁剪区域的宽度和高度
        const clipWidth = maxX - minX;
        const clipHeight = maxY - minY;
        
        // 创建结果画布 - 尺寸仅限于裁剪区域加边框
        const resultCanvas = document.createElement('canvas');
        resultCanvas.width = clipWidth;
        resultCanvas.height = clipHeight;
        
        const resultCtx = resultCanvas.getContext('2d');
        if (!resultCtx) return;
        
        // 绘制路径
        resultCtx.save();
        
        // 调整路径坐标，使其相对于裁剪区域
        resultCtx.beginPath();
        resultCtx.moveTo(path[0].x - minX, path[0].y - minY);
        for (let i = 1; i < path.length; i++) {
            resultCtx.lineTo(path[i].x - minX, path[i].y - minY);
        }
        resultCtx.closePath();
        
        // 设置阴影 - 增强阴影效果
        resultCtx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        resultCtx.shadowBlur = 8;
        resultCtx.shadowOffsetX = 0;
        resultCtx.shadowOffsetY = 3;
        
        // 绘制粗白色边框
        resultCtx.lineWidth = borderWidth;
        resultCtx.strokeStyle = 'white';
        resultCtx.stroke();
        
        // 再次绘制路径用于裁剪（没有阴影）
        resultCtx.shadowColor = 'transparent';
        resultCtx.shadowBlur = 0;
        resultCtx.shadowOffsetX = 0;
        resultCtx.shadowOffsetY = 0;
        resultCtx.beginPath();
        resultCtx.moveTo(path[0].x - minX, path[0].y - minY);
        for (let i = 1; i < path.length; i++) {
            resultCtx.lineTo(path[i].x - minX, path[i].y - minY);
        }
        resultCtx.closePath();
        
        // 剪切路径
        resultCtx.clip();
        
        // 绘制原始图像剪切部分
        resultCtx.drawImage(
            canvas, 
            minX, minY, clipWidth, clipHeight,  // 源图像的剪切区域
            0, 0, clipWidth, clipHeight         // 目标区域（从0,0开始）
        );
        
        resultCtx.restore();
        
        // 创建最终透明画布
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = resultCanvas.width;
        finalCanvas.height = resultCanvas.height;
        
        const finalCtx = finalCanvas.getContext('2d');
        if (!finalCtx) return;
        
        // 默认是透明的
        finalCtx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
        
        // 复制结果画布内容到最终画布
        finalCtx.drawImage(resultCanvas, 0, 0);
        
        // 转换为PNG格式以保留透明度
        const processedImage = finalCanvas.toDataURL('image/png');
        
        onSave(processedImage);
    };
    
    // 重置绘图
    const handleReset = () => {
        setPath([]);
        if (drawingContext) {
            drawingContext.clearRect(0, 0, imageSize.width, imageSize.height);
        }
    };
    
    return (
        <div className="flex flex-col space-y-4 px-4 py-2">
            <div className="text-center">
                <h3 className="text-lg font-medium">绘制图片边界</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    围绕您想要保留的部分画一个闭合轮廓
                </p>
            </div>
            
            <div className="relative w-full flex justify-center overflow-hidden rounded-lg shadow-sm">
                <canvas 
                    ref={canvasRef} 
                    className="absolute top-0 left-0 right-0 mx-auto"
                />
                <canvas 
                    ref={drawingRef} 
                    className="absolute top-0 left-0 right-0 mx-auto z-10"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    style={{ touchAction: 'none' }}
                />
                {/* 占位div，设置了高度和宽度，确保内容区域不会塌陷 */}
                <div style={{ width: imageSize.width, height: imageSize.height }} />
            </div>
            
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg"
                >
                    重新绘制
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg"
                >
                    取消
                </button>
                <button
                    type="button"
                    onClick={applyBoundary}
                    className="flex-1 py-2 text-xs bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-800 rounded-lg disabled:opacity-50"
                    disabled={path.length < 3}
                >
                    应用边框
                </button>
            </div>
            
            <div className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                {path.length < 3 
                    ? "请绘制一个闭合的轮廓"
                    : "准备就绪，点击应用边框效果"}
            </div>
        </div>
    );
};

export default ImageBoundaryEditor; 