function removeSpacesServices(data) {
  if(typeof data === "object"){
   for(const key in data){
    if(typeof data[key] === "string"){
        data[key]=data[key].trim()
    }else{
        data[key]=data[key]
    }
   }
  }
  return data
}
module.exports=removeSpacesServices