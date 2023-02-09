export const collectUserData = async (userIdParam,fields,setStateParam)=>{
    let response =await fetch('http://localhost:3001/collect-user-data', { 
                method: 'POST', 
                body: JSON.stringify({id: userIdParam}),
                headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Access-Control-Allow-Credentials':true
                },
                withCredentials: true,
                credentials: 'include'
            })
            if(response.ok)
            {
                const data = await response.json();
                let extractFields = {}
                fields.forEach((field)=>{
                    extractFields[field] = data[field]
                })
                setStateParam({...extractFields})
            }
            else 
            {
                let data = await response.json()
                console.log("err data:",data)
            }
}