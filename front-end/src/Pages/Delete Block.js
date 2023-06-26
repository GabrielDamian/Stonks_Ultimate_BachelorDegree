import React,{useState, useEffect} from 'react';
import LeftMenu from '../Components/Organisms/LeftMenu';
import TopBar from '../Components/Organisms/TopBar';
import './Style/DeleteBlock.css';
import RemoveIcon from '../Media/Icons/remove.png';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import DocIcon from '../Media/Icons/document.png';

export default function DeleteBlock({tabIndex,setTabs,tabs,userId})
{
    console.log("userId:",userId)
    //LAYERS
    const [layers, setLayers] = useState([]);
    const [users, setUsers] = useState([]);

    const fetchLayers = async ()=>{
        fetch('http://localhost:3001/fetch-layers', { 
            method: 'GET', 
            headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Access-Control-Allow-Credentials':true
            },
            withCredentials: true,
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data=>{
            console.log("fetch layers:", data)
            setLayers(data.layers)
        })
    }
    const fetchUsers = async ()=>{
        fetch('http://localhost:3001/all-users', { 
            method: 'GET', 
            headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Access-Control-Allow-Credentials':true
            },
            withCredentials: true,
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data=>{
            console.log("fetch users:", data)
            setUsers(data);
        })
    }

    useEffect(()=>{
        fetchLayers();
        fetchUsers();
    },[])

    return(
        <div className='delete-block-container'>
            <LeftMenu userId={userId} tabIndex={tabIndex} setTabs={setTabs} tabs={tabs} />
            <div className='delete-block-content'>
                <TopBar userId={userId}/>
                <div className='delete-block-content-data'>
                    <div className='delete-block-content-data-blocks'>
                        <h3>Delete blocks:</h3>
                    {
                        layers.map((el)=>{
                            return(<DeleteBlockItem {...el}/>)
                        })
                    }
                    </div>
                    <div className='delete-block-content-data-users'>
                        <h3>Manage users:</h3>
                        {
                            users.map((el)=>{
                                return <ManageUsers {...el} userId={userId}/>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

const SelectCustomStyle = {
    width: '200px',
    marginRight: '40px',
    color: "white",
    '.MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(228, 219, 233, 0.25)',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(228, 219, 233, 0.25)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(228, 219, 233, 0.25)',
    },
    '.MuiSvgIcon-root ': {
      fill: "white !important",
    }
  }
const DeleteBlockItem = (layer)=>{
    
    console.log("layer DATA:",layer)

    const handleButtonClick = async ()=>{
        let text = `You are about to delete ${layer.layerName} block. Are you sure ?`;
        if (window.confirm(text) == true) {
            console.log("DELETE LAYER WITH ID:", layer._id)
            // TODO executa delete
            fetch('http://localhost:3001/delete-layer', { 
                method: 'POST', 
                body: JSON.stringify({
                    layerId: layer._id,
                }),
                headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Access-Control-Allow-Credentials':true
                },
                withCredentials: true,
                credentials: 'include'
            })
            .then(res => res.json())
            .then(res => {
                console.log("Layer sters cu succes!:", res)
                alert("Layer deleted!")
                window.location.reload();
            })
            .catch((err)=>{
                console.log("Eraore la delete layer:")
                alert("Nu se poate sterge layer!")
            })
        } else {
            alert("Deletion canceled!")
            return
        }
    }
    const docRedirect = ()=>{
        window.location.href = layer.docLink
    }

    return(
        <div className='delete-block-item'>
            <div className='delete-block-item-top'>
                <div className='delete-block-item-item'>
                    <span>{layer.layerName}</span>
                </div>
                <div className='delete-block-item-item'>
                    <img  src={layer.iconLink}/>                
                </div>
            </div>
            <div className='delete-block-item-bot'>
                <div className='delete-block-item-item'>
                    <img title="-> To Documentation" onClick={docRedirect} src={DocIcon}/>
                </div>
                <div className='delete-block-item-item'>
                    <img onClick={handleButtonClick} style={{height: '20px'}}src={RemoveIcon} title="Delete Layer"/>
                </div>
            </div>
        </div>
    )
}

const ManageUsers = ({_id, username, role, userId})=>{
    
    console.log("enter:", _id, username, role, userId);

    const [roleState, setRoleState] = useState(role);

    const handleRoleSelect = (e)=>{
        setRoleState(e.target.value);
    }
    
    const handleRoleSubmit = async ()=>{
        if(role === roleState) 
        {
            alert("There no update in user rol")
            return
        }

        if(_id == userId && roleState == 'user')
        {
            let text = "You are about to lose your admin role. Are you sure ?";
            if (window.confirm(text) == true) {
                console.log("Modify my account")
            } else {
              alert("You canceled!")
              return
            }
        }   
        fetch('http://localhost:3001/update-fields', { 
            method: 'POST', 
            body: JSON.stringify({
                userId: _id,
                role: roleState
            }),
            headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Access-Control-Allow-Credentials':true
            },
            withCredentials: true,
            credentials: 'include'
        })
        .then(res => {
            window.location.reload()
        })
        .catch((err)=>{
            console.log("Eraore la update user fields:", err)
        })

    }
    const handleDeleteUser = ()=>{
       console.log("delet:",_id)
       if(_id == userId)
       {
            alert("You can't delete your own user")
            return 
       }

       let text = `Do you want to delete user: ${username} ?`;
        if (window.confirm(text) == true) {
            console.log("api delte")
            // TODO: api delete

            fetch('http://localhost:3001/delete', { 
                method: 'POST', 
                body: JSON.stringify({
                    userId: _id
                }),
                headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Access-Control-Allow-Credentials':true
                },
                withCredentials: true,
                credentials: 'include'
            })

            .then(res => res.json())
            .then(res => {
                console.log("user deleted ok:", res)
                window.location.reload()
            })
            .catch((err)=>{
                console.log("Can't delete user:", err)
        })

        } else {
            alert("You canceled user deletion!")
            return
        }
    }

    return(
        <div className='delete-block-user'>
            <div className='delete-block-user-top'>
                <div className='delete-block-user-top-item'>
                    <span>{username}</span>
                </div>
                <div className='delete-block-user-top-item'>
                    <span>{role}</span>
                </div>
            </div>
            <div className='delete-block-user-bot'>
                <div className='delete-block-user-top-item'>
                    <Select
                            placeholder='Select new role'
                            id="demo-simple-select"
                            label="specialType"
                            value={roleState}
                            onChange={handleRoleSelect}
                            name="unnamed"
                            sx={SelectCustomStyle}
                        >
                            <MenuItem value={'user'}>User</MenuItem>
                            <MenuItem value={'admin'}>Admin</MenuItem>
                        </Select>
                        
                        <button
                            title="Update Role"
                            onClick={handleRoleSubmit}
                        >Update</button>
                </div>
                <div className='delete-block-user-top-item'>
                    <img 
                        title="Delete user"
                        src={RemoveIcon}
                        onClick={handleDeleteUser}
                        />
                </div>
            </div>
        </div>
    )
}