import { NgModule } from '@angular/core';
import { ExpandableComponent } from './components-expandable/components-expandable';
import { NotificacionesComponent } from './notificaciones/notificaciones';

@NgModule({
	declarations: [ExpandableComponent,
    NotificacionesComponent],
	imports: [],
	exports: [ExpandableComponent,
    NotificacionesComponent]
})
export class ComponentsModule { }
