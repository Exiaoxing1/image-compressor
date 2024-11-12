// 获取页面上的所有必要元素
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const qualitySlider = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const originalImage = document.getElementById('originalImage');
const compressedImage = document.getElementById('compressedImage');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const downloadButton = document.getElementById('downloadButton');

// 点击上传按钮时触发文件选择
uploadButton.addEventListener('click', () => {
    fileInput.click();
});

// 监听文件选择变化
fileInput.addEventListener('change', handleFileSelect);

// 处理拖放功能
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        handleFileSelect({ target: fileInput });
    }
});

// 监听质量滑块变化
qualitySlider.addEventListener('input', (e) => {
    qualityValue.textContent = e.target.value + '%';
    if (originalImage.src) {
        compressImage();
    }
});

// 处理文件选择
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
        alert('请选择图片文件！');
        return;
    }

    // 显示原始图片
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.src = e.target.result;
        originalSize.textContent = formatFileSize(file.size);
        compressImage();
    };
    reader.readAsDataURL(file);
}

// 压缩图片
function compressImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 创建新的图片对象
    const img = new Image();
    img.src = originalImage.src;
    
    img.onload = () => {
        // 设置画布尺寸
        canvas.width = img.width;
        canvas.height = img.height;

        // 在画布上绘制图片
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 将画布内容转换为压缩后的图片
        const quality = qualitySlider.value / 100;
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // 显示压缩后的图片
        compressedImage.src = compressedDataUrl;
        
        // 计算压缩后的大小
        const compressedSizeInBytes = Math.round((compressedDataUrl.length - 22) * 3 / 4);
        compressedSize.textContent = formatFileSize(compressedSizeInBytes);
        
        // 启用下载按钮
        downloadButton.disabled = false;
    };
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 下载压缩后的图片
downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'compressed_image.jpg';
    link.href = compressedImage.src;
    link.click();
}); 