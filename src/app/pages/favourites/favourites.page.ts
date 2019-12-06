import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { Company } from 'src/app/shared/models/company';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
})
export class FavouritesPage implements OnInit {

  favouriteCompanies: Company[] = [];

  constructor(
   private storageService: StorageService,
  ) { }

  ngOnInit() {
    this.storageService.loadFavourites();
    this.storageService.favouriteCompanies.subscribe((likedCpies) => {
      this.favouriteCompanies = likedCpies;
    });
  }

}
