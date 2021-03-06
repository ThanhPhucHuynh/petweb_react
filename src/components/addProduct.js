import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Button, Form, FormGroup, Label, Input, FormText, CustomInput } from 'reactstrap'
import './signup.css';
import { Redirect , withRouter} from 'react-router-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import axios from 'axios';
import sortID from 'short-id';
// import { Redirect , withRouter} from 'react-router-dom'

class addProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isTrue: false,
            imagePreviewUrl: '',
            API_HOST : process.env.REACT_APP_API_URL
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileChangedHandler = this.fileChangedHandler.bind(this);
    }
    handleSubmit(event){
        event.preventDefault();
        const Dname =event.target.name.value;
        const Description =event.target.description.value;
        const dtype =event.target.type.value;
        const dprice =event.target.price.value;
        console.log(Dname , Description,dprice, this.state.imagePreviewUrl,"ádas"+dtype);
        if(Dname && Description && dprice && this.state.imagePreviewUrl){
            var product = {
                id: sortID.generate(),
                name: Dname,
                type: dtype,
                description: Description,
                price: dprice,
                number: event.target.number,
                img: this.state.imagePreviewUrl
            }
            axios.post('http://'+this.state.API_HOST+'/product',product)
                .then(res=>{
                    console.log(res);
                })
                .catch(err=>{
                    console.log(err);
                })
            this.setState({
                isTrue: true
            })
        }
        
    }
    fileChangedHandler = event => {
        this.setState({
          selectedFile: event.target.files[0]
        })
     
        let reader = new FileReader();
         
        reader.onloadend = () => {
          this.setState({
            imagePreviewUrl: reader.result
          });
        }
     
        reader.readAsDataURL(event.target.files[0])
     
      }

    render() {
        const { isTrue } = this.state;
        if(isTrue===false){
            
        let $imagePreview = (<div className="previewText image-container">
        <div className='contentSignUpNOne'><h1>
            REGISTER
        </h1>
        
        </div> Please select an Image for        
        </div>
            
        );
        if (this.state.imagePreviewUrl) {
        $imagePreview = (<div className="image-container" ><img src={this.state.imagePreviewUrl} alt="icon" width="200" height="200" /><div className='contentSignUp'><h1>
            REGISTER
        </h1>
        
        </div> </div>);
         }
        return (
            <Router>
            <div className='DivformSignup'>  
            <Form className='formSignup' onSubmit={this.handleSubmit}>
            { $imagePreview }
                <FormGroup>
                    <Label for="exampleEmail">Name</Label>
                    <Input type="text" name="name" id="exampleName" placeholder="Your Name" />
                </FormGroup>
                <FormGroup>
                    <Label for="exampleCustomSelect">Type</Label>
                    <CustomInput type="select" id="exampleCustomSelect" name="type">
                    {/* <option value="">Select</option> */}
                    <option>food</option>
                    <option>care</option>
                    <option>other</option>
                    </CustomInput>
                </FormGroup>
                <FormGroup>
                    <Label for="exampleDescription">description</Label>
                    <Input type="text" name="description" id="exampleDescription" placeholder="Your description" />
                </FormGroup>
                <FormGroup>
                    <Label for="price">Price</Label>
                    <Input type="number" name="price" id="examplePrice" placeholder="Price" />
                </FormGroup>
                <FormGroup>
                    <Label for="SL">Total</Label>
                    <Input type="number" name="total" id="examplePrice" placeholder="Total" />
                </FormGroup>
                <FormGroup>
                    <Label for="exampleFile">File</Label>
                    {/* <Input type="file" name="avatar" id="exampleFile" /> */}
                    <FormText color="muted">
                        This is some placeholder block-level help text for the above input.
                        It's a bit lighter and easily wraps to a new line.
                    </FormText>
                    <div className="App">
                    <Input type="file" name="img" onChange={this.fileChangedHandler} />
                    {/* <button type="button" onClick={this.submit} > Upload </button> */}
                   
      </div>

                </FormGroup>
                
                <FormGroup check>
                    <Label check>
                        <Input type="checkbox" />{' '}
          Check me out
        </Label>
                </FormGroup>
                <Button>Submit</Button>
            </Form>
            <Link to='/login'>Login</Link>
            </div>
            </Router>
        )
        }else{
            return(
                <div>
                    <h1>Complete</h1>
                </div>
            //     <Router>
            //    <Redirect
            // to={{
            //   pathname: "/login",
            //   state: { from: this.state }
            // }}

            //   />
            //     </Router>
            )
        }
    }
}


export default addProduct;