
function sizeMB(size){
    if(size<1024){
        return size+'B'; 
    }else if(size/1024>=1 && size/1024/1024<1){
        return Math.floor(size/1024*100)/100+'KB';
    }else if(size/1024/1024>=1){
        return Math.floor(size/1024/1024*100)/100+'MB';
    }
}
export default {
    sizeMB
}