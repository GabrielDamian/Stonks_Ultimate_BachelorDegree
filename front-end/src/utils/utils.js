export function TranslateBlockStructureInPythonCode(layerData, parameters)
{
    console.log("translator:",layerData, parameters)
    let parametersConcat = ""
    let final = 
    parameters.forEach((el)=>{
        let newParam = `${el.paramKeyword}=`
        if(el.values[0].type == "String")
        {
            newParam += "'" + el.values[0].value + "'"
        }
        else 
        {
            newParam += el.values[0].value

        }
        newParam += ", "
        parametersConcat += newParam
    })
    console.log("before:",parametersConcat)
    parametersConcat = parametersConcat.slice(0,-2)
    console.log("after:",parametersConcat)

    return `${layerData.keyword}(${parametersConcat})`
}