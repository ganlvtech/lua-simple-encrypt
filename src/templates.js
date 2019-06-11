import templatesString from './data/templates.lua';

let templates = {
  credit: '',
  keyInputCode: '',
  keyInputCodeGG: '',
  main: '',
  loadstring: '',
  load: '',
  decoder: '',
  decoderEnd: '',
  keyWrongAlertCode: '',
  keyWrongAlertCodeGG: '',
  keyWrongAlertEnd: ''
};
templatesString.replace(/\r\n/g, '\n')
  .split('--------------------')
  .forEach(value => {
    if (value.startsWith(' Template: ')) {
      let newlinePos = value.indexOf('\n');
      let name = value.substring(' Template: '.length, newlinePos);
      templates[name] = value.substring(newlinePos + 1);
    }
  });

export default templates;
