import { Component } from '@angular/core';
import { WebServiceService } from './web-service.service';
import { HttpClient } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  	title = 'mean-app';
  	products : any;
  	carts : any;

  	constructor (private http: HttpClient){
  	}

  	product : any;
  	quantity : Number;

  	price : any;

  	ngOnInit() {
    	this.http.get("http://localhost:3000/get_procuts").
    	subscribe((data) => {
    		this.products = data['msg'].reverse();
    	})


    	this.http.get("http://localhost:3000/get_carts").subscribe((data) => {
    		this.carts = data['msg'].reverse();
    	})
  	}

  	open_cart (Product : any){
  		this.product = Product;
  	}

  	remove_cart (_id : any, index){
  		this.http.post("http://localhost:3000/remove_from_cart", {_id : _id}).subscribe((data) => {
  			this.carts.splice(index, 1);
    	})
  	}

  	add_to_cart(){
  		if(this.quantity > 0){
  			this.price = Number(this.quantity) * Number(this.product.price);
  			let obj = {
  				ProductId:this.product._id,
  				product_name : this.product.name,
		        quantity: this.quantity,
		        price: this.price
  			}
  			this.http.post("http://localhost:3000/add_to_Cart", obj).subscribe((data) => {
  				this.http.get("http://localhost:3000/get_carts").subscribe((data) => {
		    		this.carts = data['msg'].reverse();
		    	})
  				$("#myModal").modal("hide");
  				this.quantity = 0;
	    	})
  		}
  	}
}