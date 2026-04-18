import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../features/estudiante/services/auth.service';
import { ToastComponent } from '../shared/toast/toast.component';


interface MenuItem {
  path: string;
  label: string;
  icon: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastComponent],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
})
export class MainLayoutComponent {
  
  sidebarCollapsed = false;
  today = new Date();
  currentPageTitle = 'Dashboard';
  currentView: 'admin' | 'student' | 'teacher';

  adminSections: MenuSection[] = [
    {
      title: 'General',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
      ],
    },
    {
      title: 'Académico',
      items: [
        { path: '/carreras', label: 'Carreras', icon: '📚' },
        { path: '/cursos', label: 'Cursos', icon: '📖' },
        { path: '/profesores', label: 'Profesores', icon: '👨‍🏫' },
        { path: '/asignaciones', label: 'Asignar Cursos', icon: '🔗' },
        { path: '/malla-curricular', label: 'Malla Curricular', icon: '🗂️' },
      ],
    },
    {
      title: 'Matrícula',
      items: [
        { path: '/periodos', label: 'Períodos', icon: '📅' },
        { path: '/oferta-academica', label: 'Oferta Académica', icon: '📋' },
      ],
    },
    {
      title: 'Infraestructura',
      items: [
        { path: '/aulas', label: 'Aulas', icon: '🏫' },
      ],
    },
    {
      title: 'Estudiantes',
      items: [
        { path: '/estudiantes', label: 'Lista Estudiantes', icon: '👨‍🎓' },
      ],
    },
    {
      title: 'Finanzas',
      items: [
        { path: '/finanzas', label: 'Finanzas', icon: '💰' },
      ],
    },
  ];

  studentSections: MenuSection[] = [
    {
      title: 'Mi Portal',
      items: [
        { path: '/portal/inicio', label: 'Inicio', icon: '🏠' },
        { path: '/portal/matricular', label: 'Matricular', icon: '📝' },
        { path: '/portal/historial', label: 'Historial', icon: '📊' },
        { path: '/portal/pagos', label: 'Pagos', icon: '💳' },
      ],
    },
  ];


  teacherSections: MenuSection[] = [
    {
      title: 'Mi Portal',
      items: [
        { path: '/profesor/dashboard', label: 'Dashboard', icon: '🏠' },
        { path: '/profesor/mis-cursos', label: 'Mis Cursos', icon: '📚' },
      ],
    },
  ];



  get menuSections(): MenuSection[] {
    if (this.currentView === 'admin') return this.adminSections;
    if (this.currentView === 'teacher') return this.teacherSections;
    return this.studentSections;
  }

  get userName(): string {
    if (this.currentView === 'student') {
      const perfil = this.authService.getPerfil();
      if (perfil?.nombre) {
        return `${perfil.nombre} ${perfil.apellidoPaterno}`.trim();
      }
      return 'Estudiante';
    }
    if (this.currentView === 'teacher') {
      return this.authService.getProfesorPerfil()?.nombreCompleto || 'Profesor';
    }
    return this.authService.getAdminPerfil()?.nombreCompleto || 'Administrador';
  }

  get userRole(): string {
    if (this.currentView === 'admin') return 'Administrador';
    if (this.currentView === 'teacher') return 'Profesor';
    return 'Estudiante';
  }


  mobileOpen = false;
  showSettingsMenu = false;

  get isAdmin(): boolean {
    return this.currentView === 'admin';
  }

  constructor(private router: Router, private authService: AuthService) {
    const role = this.authService.getRole();
    this.currentView = role === 'estudiante' ? 'student' : role === 'profesor' ? 'teacher' : 'admin';
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const all = [...this.adminSections, ...this.studentSections, ...this.teacherSections].flatMap((s) => s.items);
        const match = all.find((item) => event.urlAfterRedirects.startsWith(item.path));
        this.currentPageTitle = match ? match.label : 'Dashboard';
        if (event.urlAfterRedirects.startsWith('/portal')) {
          this.currentView = 'student';
        } else if (event.urlAfterRedirects.startsWith('/profesor/')) {
          this.currentView = 'teacher';
        }
        this.showSettingsMenu = false;
        this.mobileOpen = false;
      });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleMobileSidebar(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMobileMenu(): void {
    this.mobileOpen = false;
  }

  toggleSettingsMenu(): void {
    this.showSettingsMenu = !this.showSettingsMenu;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}







































