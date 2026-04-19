import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class MainLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sidebarScroller') private sidebarScroller?: ElementRef<HTMLElement>;

  
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
        { path: '/portal/malla', label: 'Malla Curricular', icon: '🗺️' },
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
  private lastSidebarTouchY: number | null = null;
  private readonly touchListenerOptions: AddEventListenerOptions = { passive: false };
  private readonly updateViewportHeight = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    document.documentElement.style.setProperty('--app-viewport-height', `${viewportHeight}px`);
  };
  private readonly handleSidebarTouchStart = (event: TouchEvent) => {
    if (!this.shouldHandleSidebarTouch(event)) {
      this.lastSidebarTouchY = null;
      return;
    }

    this.lastSidebarTouchY = event.touches[0]?.clientY ?? null;
  };
  private readonly handleSidebarTouchMove = (event: TouchEvent) => {
    if (!this.shouldHandleSidebarTouch(event) || this.lastSidebarTouchY === null) {
      return;
    }

    const scrollArea = this.sidebarScroller?.nativeElement;
    if (!scrollArea || scrollArea.scrollHeight <= scrollArea.clientHeight) {
      return;
    }

    const currentY = event.touches[0]?.clientY;
    if (currentY === undefined) {
      return;
    }

    const deltaY = this.lastSidebarTouchY - currentY;
    const maxScroll = scrollArea.scrollHeight - scrollArea.clientHeight;
    const nextScroll = Math.max(0, Math.min(maxScroll, scrollArea.scrollTop + deltaY));

    if (nextScroll !== scrollArea.scrollTop) {
      scrollArea.scrollTop = nextScroll;
      event.preventDefault();
    }

    this.lastSidebarTouchY = currentY;
  };
  private readonly handleSidebarTouchEnd = () => {
    this.lastSidebarTouchY = null;
  };

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

  ngOnInit(): void {
    this.updateViewportHeight();
    window.addEventListener('resize', this.updateViewportHeight);
    window.addEventListener('orientationchange', this.updateViewportHeight);
    window.visualViewport?.addEventListener('resize', this.updateViewportHeight);
    window.visualViewport?.addEventListener('scroll', this.updateViewportHeight);
  }

  ngAfterViewInit(): void {
    const scrollArea = this.sidebarScroller?.nativeElement;
    if (!scrollArea) {
      return;
    }

    scrollArea.addEventListener('touchstart', this.handleSidebarTouchStart, this.touchListenerOptions);
    scrollArea.addEventListener('touchmove', this.handleSidebarTouchMove, this.touchListenerOptions);
    scrollArea.addEventListener('touchend', this.handleSidebarTouchEnd);
    scrollArea.addEventListener('touchcancel', this.handleSidebarTouchEnd);
  }

  ngOnDestroy(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.removeEventListener('resize', this.updateViewportHeight);
    window.removeEventListener('orientationchange', this.updateViewportHeight);
    window.visualViewport?.removeEventListener('resize', this.updateViewportHeight);
    window.visualViewport?.removeEventListener('scroll', this.updateViewportHeight);

    const scrollArea = this.sidebarScroller?.nativeElement;
    scrollArea?.removeEventListener('touchstart', this.handleSidebarTouchStart);
    scrollArea?.removeEventListener('touchmove', this.handleSidebarTouchMove);
    scrollArea?.removeEventListener('touchend', this.handleSidebarTouchEnd);
    scrollArea?.removeEventListener('touchcancel', this.handleSidebarTouchEnd);
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleMobileSidebar(): void {
    this.updateViewportHeight();
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

  private shouldHandleSidebarTouch(event: TouchEvent): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const isTouchLayout =
      window.innerWidth <= 900 ||
      window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    return isTouchLayout && event.touches.length === 1;
  }

}







































