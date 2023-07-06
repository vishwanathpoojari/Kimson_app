import React from 'react'
import { Link } from 'react-router-dom'
import DefaultLayout from '../components/DefaultLayout'
import { Button, Col, Form, Input, Row } from 'antd'
import axios from 'axios';
import { openNotificationWithIcon } from '../helpers/notification';

const Signin = () => {
    const onFinish = (values) => {
        console.log(values); 
        axios.post('/api/users/userLogin',values)
        .then((res)=>{
            openNotificationWithIcon('success','Success','successfully added to cart');
        })
        .catch((error)=>{
            console.log(error)
            openNotificationWithIcon('warning','Warning','Failed to add!')
        })
        }
    return (
        <div className="register">
            <Row justify='center' className="flex align-tems-center">
                <Col lg={10} sm={24} className="bs p-5 mt-5 register-form">
                    <h3>Login Page</h3>
                    <hr />
                    <Form layout="vertical" onFinish={onFinish}>
                        <Form.Item label="username" name="KS_Users_email" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="password" name="KS_Users_passwordHash" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Button className="mb-3 btn btn-dark" htmlType='submit'>Sign in</Button>
                        <br></br>
                        <Link to="/signup">Don't have an account? Click here to Register</Link>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default Signin