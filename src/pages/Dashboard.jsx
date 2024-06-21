import { Button, InputNumber, Pagination, message } from 'antd'
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Axios from "axios";

export default function Dashboard() {

  const Navigate = useNavigate();

  const [leaderBoardUsers, setLeaderBoardUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [weightArray, setWeightArray] = useState([]);


  const getWeightArray = async()=>{
    const temp = await Axios.get(`${import.meta.env.VITE_SERVER}/get-weight`, {headers:{
      token:localStorage.getItem("token")
    }});
    setWeightArray(temp.data.weightArray);
    setLeaderBoardUsers(temp.data.userArray);
  }

  useEffect(()=>{
    getWeightArray();
  }, [])

  const handleLogout = ()=>{
    try{
      const signingOut = signOut(auth);
      message.success("Sign-Out Successful!");
      localStorage.clear();
      Navigate("/");
    }
    catch(error){
      console.log(error);
      message.error("Error in logging out");
    }
  }

  const handleWeight = async (e) => {
    try {

      e.preventDefault();
      console.log(e.target.weightToday.value);
      if (e.target.weightToday.value > 300) {
        console.log("Max. Weight allowed 300");
        document.getElementById("weightToday");
        document.getElementById("errorText").innerText = "Max. value allowed : 300 kg";
        return;
      }
      const response = await Axios.post(`${import.meta.env.VITE_SERVER}/add-weight`, { currWeight: e.target.weightToday.value }, {headers:{
        token:localStorage.getItem("token")
      }});
      console.log(response);
      if(response.status === 200){
        message.success(response.data.message);
      }
      else{
        message.error(response.data.message);
      }
    }
    catch (err) {
      console.log(err);
    }

  }

  const handlePagination = (e)=>{
    // e.preventDefault();
    
  }

  const photoURL = localStorage.getItem("photoURL");
  console.log(photoURL);

  return (
    <div className="text-center">
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", maxWidth: "300px", margin: "15px auto", borderBottom: "1px dashed lightgray" }}>

        <div>{photoURL? <img src={photoURL} alt="" width="15px" style={{borderRadius:"50%"}} /> :<UserOutlined />} {localStorage.getItem("name").split(' ')[0]} </div>
        <div className='logout' onClick={handleLogout}><LogoutOutlined /> Logout</div>

      </div>
      <div style={{ margin: "20px 0" }}>

        Add your today's weight (in kg)
        <form onSubmit={handleWeight}>
          <p><InputNumber id='weightToday' min={1} placeholder='64' controls={false} required /></p>
          <div style={{ color: "crimson", fontSize: "10px", fontWeight: "bold" }} id='errorText' ></div>

          <Button type="primary" htmlType='submit'>Submit</Button>
        </form>
      </div>

      <h3>My Weight Chart</h3>

      {weightArray.length != 0 ? <div style={{ display: "flex", border:"1px dashed lightblue", justifyContent: "center", minHeight: "150px",overflowX: "auto", maxWidth:"330px", margin:"auto" }}>

        {weightArray.map((item, index) => {
          console.log(item);
          return <div style={{ position: "relative", margin: "20px" }}>

            <div style={{ height: `${item.weight}px`, width: "30px", position: "absolute", maxHeight: "100px", background: "skyblue", bottom: "0" }}>{item.weight}</div>

          </div>
        })
        }

      </div> : <div style={{ border: "1px dashed lightblue", maxWidth: "fit-content", margin: "auto", padding: "5px", fontSize: "10px" }}>
        <div>Add your first weight..</div>
        <div>Make your chart with colors</div>
      </div>}

      <h1 style={{ marginBottom: "2px" }}>Globalboard <i style={{ color: "gold" }} className="fa-solid fa-crown"></i></h1>
      <sub>According to latest updated weights</sub>

      <div>
        {leaderBoardUsers.map((item, index) => {
          return <div className='text-left' style={{ maxWidth: "300px", margin: "auto" }}>
            <p>{item.email.split('@')[0]}</p>
            <div style={{ position: "relative", margin: "20px 0" }}>
              <div style={{ width: `${item.weight}%`, position: "absolute", maxHeight: "100px", background: "skyblue", bottom: "0", fontWeight: "bold" }}>{item.weight}</div>
            </div></div>
        })}
      </div>
      <div style={{ marginTop: "30px" }}>
        <Pagination defaultCurrent={1} total={50} onChange={(e)=>console.log(e.target.value)} />
      </div>

    </div>
  )
}
