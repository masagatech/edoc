import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LibEditorComponent } from './libeditor/home.comp';
import { LibViwerComponent } from './libviwer/home.comp';


const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [{
        path: 'libeditor',
        component: LibEditorComponent
    }, {
        path: 'libviwer',
        component: LibViwerComponent

    }]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
