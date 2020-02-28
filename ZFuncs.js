const callCrmFunction = async (reqData, funcName, extraData) => {
  if (extraData) Object.assign(reqData, { arguments: JSON.stringify(extraData) });
  console.log('REQ_DATA:', reqData);
  try {
    return ZOHO.CRM.FUNCTIONS.execute(funcName, reqData);
  } catch (error) {
    throw error;
  }
};

const checkResponse = response => {
  console.log('RESPONSE:', response);
  if (response.code !== 'success' || !response.details.output) return false;
  const output = JSON.parse(response.details.output);
  if (output.status === 'error') return false;
  return output;
};

const checkResponseArray = (response, removeComma) => {
  console.log('RESPONSE:', response);
  if (response.code !== 'success' || !response.details.output) return false;
  let output = response.details.output;
  if (removeComma) output = output.substring(0, output.length - 1);
  output = JSON.parse(`[${output}]`);
  if (output[0].status === 'error') return false;
  return output;
};

const pagesGen = n => {
  let numberList = '';
  for (let i = 1; i <= n; i++) {
    numberList += i + ',';
    if (i === n) return numberList;
  }
};

class zfuncs {
  constructor(zapikey) {
    this.reqData = zapikey ? { auth_type: 'apikey', zapikey } : { auth_type: 'oauth' };
  }
  async Bulk_Record_Create({ module, recordsList }) {
    return checkResponse(await callCrmFunction(this.reqData, 'Bulk_Record_Create', arguments[0]));
  }
  async Delete_Record({ module, recID }) {
    return checkResponse(await callCrmFunction(this.reqData, 'Delete_Record', arguments[0]));
  }
  async Get_All_Records({ module, pages = 1 }) {
    arguments[0].pages = pagesGen(pages);
    return checkResponseArray(await callCrmFunction(this.reqData, 'Get_All_Records', arguments[0]), true);
  }
  async Search_Record_By_ID({ module, recID }) {
    return checkResponse(await callCrmFunction(this.reqData, 'Search_Record_By_ID', arguments[0]));
  }
  async Search_Related_List({ relatedList, module, recID }) {
    return checkResponseArray(await callCrmFunction(this.reqData, 'Search_Related_List', arguments[0]));
  }
  async Search_Related_List_Array({ relatedList, module, arrayID }) {
    return checkResponseArray(await callCrmFunction(this.reqData, 'Search_Related_List_Array', arguments[0]));
  }
  async Search_Records_By_One_Param({ module, paramName, paramValue, pages = 1 }) {
    arguments[0].pages = pagesGen(pages);
    return checkResponseArray(await callCrmFunction(this.reqData, 'Search_Records_By_One_Param', arguments[0]), true);
  }
  async Search_Records_By_Two_Param({ module, paramNameOne, paramValueOne, paramNameTwo, paramValueTwo, pages = 1 }) {
    arguments[0].pages = pagesGen(pages);
    return checkResponseArray(await callCrmFunction(this.reqData, 'Search_Records_By_Two_Param', arguments[0]), true);
  }
  async Update_Record({ module, recordID, dataMap, trigger = ['workflow'] }) {
    return checkResponse(await callCrmFunction(this.reqData, 'Update_Record', arguments[0]));
  }
  async Upsert_Record({ module, dataMap, trigger = ['workflow'] }) {
    return checkResponse(await callCrmFunction(this.reqData, 'Upsert_Record', arguments[0]));
  }
  async Get_Models_From_Creator() {
    let response = await callCrmFunction(this.reqData, 'Get_Models_From_Creator');
    if (response.code !== 'success') return false;
    return response.details.output.split(',');
  }
  async procurarContaContacto({ tipo, chaveAgrupamentoCliente, email, telemovel, nipc, skipDeal }) {
    return checkResponse(await callCrmFunction(this.reqData, 'procurarcontacontacto', arguments[0]));
  }
}

exports.module = zfuncs;
