import React, { Component } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardImg,
    CardText,
    CardBody,
    CardTitle,
    CardSubtitle,
    Button,
    Media,
    Pagination, PaginationItem, PaginationLink,
    Form, FormGroup, Label, Input, FormText, CustomInput
  } from "reactstrap";
  import Swal from 'sweetalert2'
  import Modal from 'react-awesome-modal';
  import PropTypes from "prop-types";
  import "./product.css";
  import axios from "axios";
  import  "./card.css";
  import Cookie from 'js-cookie';
  import sortID from 'short-id';
class Cart extends Component{
    constructor(props){
        super(props);
        this.state={
            cartProduct: [],
            price:[],
            visible : false,
            API_HOST : process.env.REACT_APP_API_URL
        }
        this.delItem = this.delItem.bind(this)
        this.changeNumber= this.changeNumber.bind(this)
        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    componentDidMount(){
        if(localStorage.getItem('cartProduct')!=null){
        let item = JSON.parse(localStorage.getItem('cartProduct'));
        var Gia=0;  
        for(var i of item){
          console.log(i)
            Gia = Gia+ Number(i.price)*i.number
          }
          
         console.log('kkkkb',item,Gia);
          this.setState({
            cartProduct: [...item],
            price : Gia
          })
         
        }
       
      }
    openModal() {
        this.setState({
            visible : true
        });
      }
 
    closeModal() {
        this.setState({
            visible : false
        });
      }
    delItem(product){
      let cartProduct = [...this.state.cartProduct];
      var flag;
      for(var an in cartProduct){
        if(product.id === cartProduct[an].id){
          flag=an;
          continue;
        }
     }
     if(flag){
       cartProduct.splice(flag,1);
     }
     var Gia =0;
     for(var i of cartProduct){
      Gia = Gia+ Number(i.price)*i.number
    }
     this.setState({
       cartProduct: [...cartProduct],
       price: Gia
     })
     localStorage.setItem("cartProduct",JSON.stringify(cartProduct))
     this.props.getData();
    }
    changeNumber(x,product){
        console.log(x);
        let a = this.state.cartProduct.findIndex(tmp => tmp.id===product.id)
        let productTmp = [...this.state.cartProduct]
        if(x===1){
          productTmp[a].number++;
        }else{
          productTmp[a].number--;
          
        }
        if(productTmp[a].number <=0 ){
          this.delItem(product)
        }else{
          
          var Gia =0;
          for(var i of productTmp){
           Gia = Gia+ Number(i.price)*i.number
             }
          this.setState({
            cartProduct: [...productTmp],
            price: Gia
          })
          localStorage.setItem("cartProduct",JSON.stringify(productTmp))
        }
    }
    handleSubmit(event) {
      event.preventDefault();
      const address = event.target.address.value;
      const phone = event.target.phone_number.value;
      const email = Cookie.get('email');
      if(address==''||phone==''){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: '<a href>Why do I have this issue?</a>'
        })
      }else{
        // console.log(email,address,phone);
        const listIdProduct = this.state.cartProduct.map(product=>{
            return product.id
        })
        let Order ={
          id: sortID.generate(),
          email: email,
          phone: phone,
          address: address,
          idproduct: JSON.stringify(listIdProduct),
          price: this.state.price,
          status: 0
        }
        console.log(JSON.stringify(Order));
        console.log(typeof (Order.phone));


        axios.post('http://'+this.state.API_HOST+':1234/order',Order)

        .then(res=>{
            console.log(res,"thanh cong");
        })
        .catch(err=>{
            console.log(err);
        })
        let timerInterval
        Swal.fire({
          title: 'Tiến hành đặt hàng!',
          html: 'Ordering.....<b></b>',
          timer: 2000,
          timerProgressBar: true,
          onBeforeOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
              const content = Swal.getContent()
              if (content) {
                const b = content.querySelector('b')
                if (b) {
                  b.textContent = Swal.getTimerLeft()
                }
              }
            }, 100)
          },
          onClose: () => {
            clearInterval(timerInterval)
          }
        }).then((result) => {
          Swal.fire({
            icon: 'success',
            title: 'Thank you...',
            text: 'Thành Công!',
            timer: 1000,
          })
          localStorage.removeItem('cartProduct')
          /* Read more about handling dismissals below */
          window.location.replace("/main/home")
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log('I was closed by the timer')
          }
        })


        
      }




     

    }
    render(){
        const {cartProduct,price} = this.state
        console.log(price,this.props);
        
        if(cartProduct.length===0){
            return(
              <div className="cartMain">
                <div className="cartContent">
                      <h1  className="contenProductMain">Cart</h1>
                </div>
                <Row className="row_cart">
                  <div className="cart">
                    <p className="noThingsItem">Nothing.....</p>
                  </div>
                </Row>
                
            </div>
            )
        }else{
            let number = cartProduct.number;
            if(!number){
                number = 0;
            }
            return(
                <div className="cartMain">
                    <div className="cartContent">
                      <h1 className="contenProductMain">Cart</h1>
                    </div>
                    <Row className="row_cart">
                    <div className="cart">
                      
                    
                      { cartProduct.map((product,index)=>(
                        
                            <Media className="mediaCart" key={index}>
                            <Media left href="#">
                              <Media object src={product.img} alt="product image" />
                            </Media>
                            <Media body>
                              <Media heading>
                                {product.name}
                              </Media>
                              <p> $ {product.price}</p>
                              {/* Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus. */}
                              <div className="countCart">
                             
                              <Pagination size="sm" aria-label="Page navigation example" className="panigation_lable">
                                  <PaginationItem>
                                    <PaginationLink previous onClick={()=>this.changeNumber(0,product)} />
                                  </PaginationItem>
                                  <p className="numberCart">SL: {product.number}</p>
                                  <PaginationItem>
                                    <PaginationLink next  onClick={()=>this.changeNumber(1,product)}/>
                                  </PaginationItem>
                            </Pagination>
                              </div>
                             
                              <Button className="btn_cart" onClick={()=>{
                                this.delItem(product)
                              }}>remove</Button>
                            </Media>
                          </Media> 
                          
                      ))}
                    </div>
                    </Row>
                    <section>
                    <Button color="primary" className="btnPrice" onClick={this.openModal}> BUY ${ price } </Button>
                    <Modal visible={this.state.visible} width="400" height="50%" effect="fadeInUp" onClickAway={this.closeModal}>
                        <div className="Price">
                            <h1>THANHTOAN</h1>
                            <p>Name: {this.props.nameUser}</p>
                            <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                              <Input  type="tel" pattern="[0-9]{10}" name="phone_number" id="phone_number" placeholder="Phone Number..." required />
                              <Input type="textarea" name="address" id="address" placeholder="address..." />
                              <p className="Price_gia"> Total: ${ price }</p>
                            </FormGroup>
                                <FormGroup>
                                    <Label for="exampleCustomSelect">Type</Label>
                                    <CustomInput type="select" id="exampleCustomSelect" name="typePrice">
                                    {/* <option value="">Select</option> */}
                                    <option>COD</option>
                                    <option>MoMo</option>
                                    <option>Visa</option>
                                    </CustomInput>
                                </FormGroup>
                                <Button className="btn_thanhtoan" color="info" >Thanh Toán</Button>
                            </Form>

                              {/* <a  onClick={this.closeModal}>Close</a> */}
                        </div>
                    </Modal>
                    </section>
                </div>
            )
        }
    }
}
  export default Cart;