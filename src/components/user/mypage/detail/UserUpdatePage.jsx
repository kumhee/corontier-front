import React,{useContext, useState, useEffect ,useRef} from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { BoxContext } from '../../../BoxContext';
import axios from 'axios';
import ModalPwdUpdate from './ModalPwdUpdate';

const UserUpdatePage = () => {
  const { setBox } = useContext(BoxContext);
  
  const [user, setUser] = useState({
    user_id:'',
    password :'',
    email:'',
    nickname :'',
    profile_image :'',
    file:null
    //login id 할건지?
  });
  const {user_id, password,email, nickname, profile_image,file} = user;
  const ref_file = useRef(null);

  const getUser=async()=>{

    //로그인구현전 예시로 넣은 로그인된 user정보 
    sessionStorage.setItem('user_id',1);
    //user정보가져오는 쿼리
    const res = await axios.get(`/users/read/${sessionStorage.getItem("user_id")}`);  
    setUser(res.data);
  }
  //첫 랜더링시 해당 USER정보 가져오기
  useEffect(()=>{
    getUser();
  },[]);
  
  //input변경값적용
  const onChange=(e)=>{
    setUser({
      ...user,
      [e.target.name]:e.target.value
    })
  }
  //수정하기버튼
  const onUpdate = async(e)=>{
    e.preventDefault();
    setBox({
      show:true,
      message:'정보를수정하시겠어요?',
      action: async()=>{
        //수정 api
      }
    })
    
  }

  const onChangeFile =(e)=>{  
    setUser({
      ...user,
      profile_image:URL.createObjectURL(e.target.files[0])||"",
      file:e.target.files[0]
    })
  }
  const onUpdateProfileIMG =async()=>{
    if(!file){
      setBox({
        show:true,
        message:'수정할 사진을 선택해 주세요'
      });
    } else {
      setBox({
        show:true,
        message:'변경된 사진을 저장합니다',
        action:async()=>{
          const formData = new FormData();
          formData.append('file',file);              
          await axios.post('/users/update/profile?user_id=' + user_id, formData);
          //user_id를 multer에서 upload할때 filename에 넣으려고 따로 쿼리로보냄(header에넣어서 보내는방법도있음 ->서버에서 const user_id = req.headers['user-id'];로받음)
        }
      })
    }
  }
  return (
    <div className='page_wrap'>
      <div className='userupdatepage_wrap'>
        <div className='userupdatepage_title'>
          <p>✏️ 개인정보 수정</p>
        </div>
        <div className='userupdatepage_contents'>
          <div className='userupdatepage_img'>
            <img src={profile_image||"http://via.placeholder.com/250x250"} width="100" className='photo' />
            <input  type="file" ref={ref_file} onChange={onChangeFile} style={{display:'none'}}/>
            <Button onClick={()=>{ref_file.current.click()}}>변경</Button><Button onClick={onUpdateProfileIMG}>저장</Button>
          </div>
          <div className='userupdatepage_userid'>
            <p>USERID</p>
          </div>
          <div className='userupdatepage_updateform'>
            <div className='userupdatepage_col'>
              <form onSubmit={onUpdate}>
                <InputGroup className='inputgroup mb-2'>
                  <InputGroup.Text>아이디</InputGroup.Text> 
                  {/* user_id auto_increase되는 index일뿐이라  user를 특정할 login id?컬럼을 만드는지 이메일로 대체하는지? */}
                  <div className='px-3'><h3>{user_id}</h3> </div> 
                </InputGroup>

                <InputGroup className='inputgroup mb-2'>
                  <InputGroup.Text>비밀번호</InputGroup.Text>
                  <Form.Control name='password' value={password} style={{display:'none'}} onChange={onChange} readOnly/>
                  <ModalPwdUpdate user={user} setUser={setUser}/>            
                </InputGroup>

                <InputGroup className='inputgroup mb-2'>
                  <InputGroup.Text>이메일</InputGroup.Text>
                  <Form.Control name='email' value={email} onChange={onChange}/>
                </InputGroup>

                <InputGroup className='inputgroup mb-2'>
                  <InputGroup.Text>닉네임</InputGroup.Text>
                  <Form.Control name='nickname' value={nickname} onChange={onChange}/> 
                </InputGroup>

                <div className='updatebutton_group'>
                  <Button variant='dark' className='me-2 px-5' type='submit'>저장</Button>
                  <Button  onClick={()=>getUser()} variant='outline-dark' className='px-5' type='reset'>취소</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserUpdatePage