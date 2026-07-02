import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Perfil } from './pages/perfil/perfil';
import { Recuperar } from './pages/recuperar/recuperar';
import { Inicio } from './pages/inicio/inicio';
import { Productos } from './pages/productos/productos';
import { Carrito } from './pages/carrito/carrito';
import { MisCompras } from './pages/mis-compras/mis-compras';
import { AdminProductos } from './pages/admin-productos/admin-productos';
import { AdminUsuarios } from './pages/admin-usuarios/admin-usuarios';
import { Admin } from './pages/admin/admin';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'perfil', component: Perfil },
  { path: 'recuperar', component: Recuperar },
  { path: 'inicio', component: Inicio },
  { path: 'productos', component: Productos },
  { path: 'mis-compras', component: MisCompras },
  { path: 'admin-productos', component: AdminProductos },
  { path: 'carrito', component: Carrito },
  { path: 'admin-usuarios', component: AdminUsuarios },
  { path: 'admin', component: Admin },
  { path: '**', redirectTo: 'inicio' }
];