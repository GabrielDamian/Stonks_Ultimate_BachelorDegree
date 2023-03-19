import TextField from '@mui/material/TextField';
import { alpha, styled } from '@mui/material/styles';

export function TranslateBlockStructureInPythonCode(layerData, parameters)
{
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
    parametersConcat = parametersConcat.slice(0,-2)

    return `${layerData.keyword}(${parametersConcat})`
}

export const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
      color: '#bcfe2f',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#bcfe2f',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#bcfe2f',
      },
      '&:hover fieldset': {
        borderColor: 'yellow',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#a3db29',
      },
    },
});