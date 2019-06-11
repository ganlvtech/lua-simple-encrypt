/** @link https://stackoverflow.com/questions/3582671/how-to-open-a-local-disk-file-with-javascript/26298948#26298948 */
function readAsByteArray(file, callback) {
  let reader = new FileReader();
  reader.onload = function (e) {
    let arrayBuffer = e.target.result;
    let uint8Array = new Uint8Array(arrayBuffer);
    let array = [].slice.call(uint8Array);
    callback && callback(array, file);
  };
  reader.readAsArrayBuffer(file);
}

export {
  readAsByteArray
};
