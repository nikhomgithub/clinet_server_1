//import React from 'react'
import ImageCompressor from 'js-image-compressor'

function fileListItem(a) {
    a = [].slice.call(Array.isArray(a) ? a : arguments)
    for (var c, b = c = a.length, d = !0; b-- && d;) d = a[b] instanceof File
    if (!d) throw new TypeError("expected argument to fileList1 is File or array of File objects")
    for (b = (new ClipboardEvent("")).clipboardData || new DataTransfer; c--;) b.items.add(a[c])
    return b.files
} 
//=================================
/*
concept: we have 2 purpose 
1. to show photoUrl_ and fileUrl on Galleryone_add
2. to add update file_ in inputState of form

how it work: 
1. from <input/> we get e.target.file = files
2. we put use handleInputFile() => to update arrayFile
3. we use changeArrayFile() => create fileList 
    3.1 update file_:fileList in inputState  
    3.2 update fileUrl : with name & blob to show image

Show Image: 
    we use url from 2 source 
    1. from photoUrl_
    2. from fileUrl 

Delete fileUrl:
    1. use name + arrayFile , update arrayFile with out file => changeArrayFile() => file_:fileList, fileUrl
Delete photoUrl:

*/
//=================================
const reduceImageSize=(file,i)=>{
    //const file=e.target.files[0]
    //const files = [...e.target.files]
    //console.log(files.length)
    return new Promise( (resolve,reject)=>{
            const options = {
                file:file,quality: 0.6,mimeType:file.type,
                maxWidth: 1280,maxHeight: 1280, width: 700,height: 700,
                minWidth: 300,minHeight: 300,convertSize: Infinity,
                loose: true,redressOrientation: true,
            
                // Callback before compression
                beforeCompress: function (result) {
                console.log(`Image size before compression: ${i}`, result.size);
                //console.log(`mime type: ${i}`, result.type);
                },
    
                // Compression success callback
                success: async (result) => {
                console.log(`Image size after compression: ${i}`, result.size);
                //console.log(`mime type: ${i}`, result.type);
                //console.log(`Actual compression ratio: ${i}`, ((file.size-result.size) / file.size * 100).toFixed(2) +'%');
                //console.log(result)
                    resolve(result)
                },
                // An error occurred
                error: function (msg) {
                    console.error(msg);
                    reject(msg)
                }
            }
            const atemp=new ImageCompressor(options)
    })
    
}


//=================================
//arrayFile ==>from e.target.file
const handleInputFile=async({files,arrayFile,setArrayFile})=>{
    let unique=Array.from(new Set([...arrayFile,...files]))
    setArrayFile(unique)   
}
//================================
const changeArrayFile=async({
    arrayFile,fileUrl,setFileUrl,
    inputState,setInputState,
    keyName,
    //fileName,
    //serverFolder,
    setShowImage})=>{


const endNumber=keyName.split("photoUrl")[1]
//const endNumber=fileName.split("file")[1]

//================
let tempFileUrl=[]
let promiseArray=[]

    for(let i=0;i<arrayFile.length;i++){
        
            promiseArray=[...promiseArray,reduceImageSize(arrayFile[i],i)]
    }

Promise.all(promiseArray).then((tempBlobArray) => {
    tempBlobArray.map(i=>{
        const tempObject={ name:i.name,
                          blob:URL.createObjectURL(i)}
        tempFileUrl=[...tempFileUrl,tempObject]
    })

    setFileUrl(tempFileUrl)
  
    setInputState({...inputState,
            [`file${endNumber}`]:tempBlobArray,
    })
    reloadImage({setShowImage})
});

}


/*
const changeArrayFile=({
        arrayFile,fileUrl,setFileUrl,
        inputState,setInputState,
        keyName,
        //fileName,
        //serverFolder,
        setShowImage})=>{

    const tempFileList= new fileListItem( arrayFile )

    const endNumber=keyName.split("photoUrl")[1]
    //const endNumber=fileName.split("file")[1]

    //================
    let tempFileUrl=[]
    for(let i=0;i<tempFileList.length;i++){
        
        const tempObject={ name:tempFileList[i].name,
                           blob:URL.createObjectURL(tempFileList[i])}
        

        tempFileUrl=[...tempFileUrl,tempObject]
    }


    setFileUrl(tempFileUrl)

      
    setInputState({...inputState,
             [`file${endNumber}`]:tempFileList,
    })
    reloadImage({setShowImage})
}
*/

//==================================

//====================================

const reloadImage=({setShowImage})=>{
    setShowImage(false)
    setTimeout(()=>{
        setShowImage(true)
    },100)
}
//===================================

const resetFile=({setArrayFile,setFileUrl})=>{
    setArrayFile([])
    setFileUrl([])
}
//===================================
const deleteFileUrl=({name,arrayFile,setArrayFile,
    reloadImage,setShowImage})=>{

    let tempArray=[]
    arrayFile.map((i,index)=>{
        if(i.name!==name){
            tempArray.push(i)
        }
        return tempArray
    })
    setArrayFile(tempArray)   
    reloadImage({setShowImage});   
}
//=========================================
const deletePhotoUrl=({name,inputState,setInputState,keyName,
    reloadImage,setShowImage})=>{
        
    let temp=[]
    
    const tempLength=inputState[keyName].length
    //from photoUrl_:["xxx","yyy"]
    //exclude target from photoUrl: ["xxx"]    

    if(tempLength>0){
        for(let i=0;i<tempLength;i++){
            if(inputState[keyName][i]!=name){
                temp=[...temp,inputState[keyName][i]]
            }
        }
    }
    // in case we have array of one , we need to put [""]
    // so final photoUrl:[""] just like in blankState
    if(temp.length==0){
        temp=[""]
    }

    const tempInputState={...inputState,[keyName]:temp}
    
   
    setInputState({...tempInputState})
    
    reloadImage({setShowImage})
}
//==================================

const photoUtil={fileListItem,changeArrayFile,handleInputFile,
    reloadImage,resetFile,deleteFileUrl,deletePhotoUrl}

export default photoUtil
