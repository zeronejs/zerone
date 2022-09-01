/**
 * 获取图片的 base64 编码
 * @param image 图像对象
 * @return {string} 返回已编码的 base64数据
 */
export const getImageBase64 = (image: HTMLImageElement): string => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(image, 0, 0, image.width, image.height);
    // 获取图片后缀名
    const extension = image.src.substring(image.src.lastIndexOf('.') + 1).toLowerCase();
    // 某些图片 url 可能没有后缀名，默认是 png
    return canvas.toDataURL('image/' + extension, 1);
};

/**
 * 单张图片下载
 * @param url 图像链接
 * @param downloadName 图片名称
 */
export const downloadImage = (url: string, downloadName = 'img.png') => {
    // if (isIos()) {
    //     return Toast('长按图片保存');
    // }
    const link = document.createElement('a');
    link.setAttribute('download', downloadName);
    const image = new Image();
    // 添加时间戳，防止浏览器缓存图片
    image.src = url;
    // 设置 crossOrigin 属性，解决图片跨域报错
    image.setAttribute('crossOrigin', 'Anonymous');
    image.onload = () => {
        link.href = getImageBase64(image);
        link.click();
    };
};
