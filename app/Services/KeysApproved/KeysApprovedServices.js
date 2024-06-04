function validateObjectKeys(dataObject, requiredKeys) {
  const objectKeys = Object.keys(dataObject);
  const isKeyMatch = requiredKeys.every(key => objectKeys.includes(key)) && objectKeys.length === requiredKeys.length;

  if (!isKeyMatch) {
    return {
      error: true,
      message: "Kesalahan: Objek tidak memiliki keys yang sesuai atau jumlah keys tidak cocok."
    };
  }
  return {
    error: false,
    data: dataObject
  };
}

function checkArrayValuesInCounter(arrayValues, counterArray) {
  return arrayValues.every(value => counterArray.includes(value));
}


module.exports={validateObjectKeys,checkArrayValuesInCounter}

