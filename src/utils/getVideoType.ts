const mimeTypes = {
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    mkv: 'video/x-matroska',
    flv: 'video/x-flv',
    wmv: 'video/x-ms-wmv',
    mpeg: 'video/mpeg',
    mpg: 'video/mpeg',
    webm: 'video/webm',
    m4v: 'video/x-m4v',
    '3gp': 'video/3gpp'
  };

export const getTypeOfVideo = (url: string | undefined) => {
    if(url){
    const extension = url?.split('.')?.pop()?.toLowerCase();
    return mimeTypes[extension as keyof typeof mimeTypes] || 'video/mp4';
    }
    else return "video/mp4";
}