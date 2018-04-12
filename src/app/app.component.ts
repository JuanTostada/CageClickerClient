import { Component, Input, OnInit } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import { ModalComponent} from './modal/modal.component';
import { ToasterService } from 'angular2-toaster';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  title = 'app';
  world: World = new World();
  server: String;
  qtmulti: any;
  toasterService: ToasterService;
  argentTotal: any;

  ngOnInit() {
    this.qtmulti = 1;
    this.argentTotal = this.world.money;
  }

  constructor (service: RestserviceService, toasterService: ToasterService) {
   this.server = service.getServer();
   this.toasterService = toasterService;
   service.getWorld().then(
     world => {
      this.world = world;
      });
  }

  onProductionDone(p: Product) {
      this.world.money = this.world.money + p.revenu + (p.revenu*p.quantite);
  }

  onBuy(sum: number) {
      this.world.money -= sum;
  }

  hireManager(m: Pallier) {
    if(this.world.money>m.seuil) {
      this.onBuy(m.seuil);
      m.unlocked=true;
      this.world.products.product[m.idcible - 1].managerUnlocked=true;
      this.toasterService.pop('success', 'Manager hired ! ', m.name);
    }
  }

  buyUpgrade(u: Pallier) {
    if(this.world.money>u.seuil) {
      this.onBuy(u.seuil);
      u.unlocked=true;
      this.toasterService.pop('success', 'New Upgrades ! ', u.name);
      this.world.products.product[u.idcible - 1].revenu = this.world.products.product[u.idcible - 1].revenu*u.ratio;
    }
  }
   buyUnlock(u: Pallier) {
     this.onBuy(u.seuil);
     u.unlocked=true;
     this.toasterService.pop('success', 'New Unlocks ! ', u.name);
     this.world.products.product[u.idcible - 1].vitesse = this.world.products.product[u.idcible - 1].vitesse/u.ratio;
   }

  boucleAchat(){
    if (this.qtmulti == 1) {
      this.qtmulti =10;
    }
    else if (this.qtmulti == 10) {
      this.qtmulti =100;
    }
    else if (this.qtmulti == 100) {
      this.qtmulti = "max";
    }
    else if (this.qtmulti == "max") {
      this.qtmulti =1;
    }
  }

}
