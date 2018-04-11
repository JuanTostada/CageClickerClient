import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {Product} from '../world';
import { ToasterService } from 'angular2-toaster';
import { ModalComponent} from './modal/modal.component';

declare var require;
const ProgressBar = require("progressbar.js");

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

 @ViewChild('bar') progressBarItem;
  progressbar: any;
  lastupdate= 0;
  product: Product;
  _qtmulti: any;
  _argentTotal: any;
  val: any;
  toasterService: ToasterService;
  test: any;

  constructor(toasterService: ToasterService;) {
    this.toasterService = toasterService;
   }

  ngOnInit() {
    setInterval(() => { this.calcScore(); }, 100);
    this.progressbar = new ProgressBar.Line(this.progressBarItem.nativeElement, { strokeWidth: 150, color:'#729fd6' });
  }

   @Input()
   set qtmulti(value: any) {
     this._qtmulti = value;
     this.val = "pas max";
     if (this._qtmulti == "max") {
       this.calcMaxCanBuy();
       this.val = "max";
     }
   }

  @Input()
  set prod(value: Product) {
    this.product = value;
  }

  @Input()
  set argentTotal(value: any) {
    this._argentTotal = value;
  }

  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() notifyArgent: EventEmitter<Product> = new EventEmitter<Product>();


  startFabrication(){
    if(this.product.timeleft==0){
      this.progressbar.animate(1, { duration: this.product.vitesse });
      this.product.timeleft=this.product.vitesse;
      this.lastupdate = Date.now();
    }
  }


  calcScore(toasterService: ToasterService){
    if(this.val == "max") {
        this.calcMaxCanBuy();
    }

    if (this.product.managerUnlocked==true) {
      this.startFabrication();
    }

    if(this.product.timeleft>0) {
      let temps = Date.now() - this.lastupdate;
        this.product.timeleft = this.product.vitesse - temps;
        if(this.product.timeleft<=0) {
          this.product.timeleft=0;
          this.notifyProduction.emit(this.product);
          this.progressbar.set(0);
          }
      }
  }

  buy(){
    let sum;
    sum = this.product.cout*((1-Math.pow(this.product.croissance,this._qtmulti))/(1-this.product.croissance));
    if(this._argentTotal>=sum) {
      this.product.quantite+=this._qtmulti;
      this.product.cout=this.product.cout*Math.pow(this.product.croissance,this._qtmulti);
      this.notifyArgent.emit(sum);
    }
    this.product.palliers.pallier.forEach(unlock => {
      if(!unlock.unlocked){
          if(this.product.quantite>=unlock.seuil){
        unlock.unlocked=true;
        this.product.vitesse = this.product.vitesse/unlock.ratio;
        this.toasterService.pop('success','Unlock débloqué !', unlock.name);
      };
      };
    });
  }

  calcMaxCanBuy() {
    let sum;
    sum = Math.floor(Math.log(1 - (this._argentTotal / this.product.cout) * (1 - this.product.croissance)) / Math.log(this.product.croissance));
    this._qtmulti = sum;
  }

}
