import { Injectable, effect, signal, computed } from '@angular/core';
import { Subject } from 'rxjs';
import { $t } from '@primeng/themes';
import Aura from '@primeng/themes/aura';
import Lara from '@primeng/themes/lara';
import Nora from '@primeng/themes/nora';

const presets = { Aura, Lara, Nora } as const;

export interface layoutConfig {
	preset?: string;
	primary?: string;
	surface?: string | undefined | null;
	darkTheme?: boolean;
	menuMode?: string;
}

interface LayoutState {
	staticMenuDesktopInactive?: boolean;
	overlayMenuActive?: boolean;
	configSidebarVisible?: boolean;
	staticMenuMobileActive?: boolean;
	menuHoverActive?: boolean;
}

interface MenuChangeEvent {
	key: string;
	routeEvent?: boolean;
}

@Injectable({ providedIn: 'root' })
export class LayoutService {
	layoutConfig = signal<layoutConfig>({
		preset: 'Nora',
		primary: 'fuchsia',
		surface: null,
		darkTheme: false,
		menuMode: 'static'
	});

	layoutState = signal<LayoutState>({
		staticMenuDesktopInactive: false,
		overlayMenuActive: false,
		configSidebarVisible: false,
		staticMenuMobileActive: false,
		menuHoverActive: false
	});

	private configUpdate = new Subject<layoutConfig>();
	private overlayOpen = new Subject<void>();
	private menuSource = new Subject<MenuChangeEvent>();
	private resetSource = new Subject<void>();
	private closeMenusSource = new Subject<void>();

	menuSource$ = this.menuSource.asObservable();
	resetSource$ = this.resetSource.asObservable();
	configUpdate$ = this.configUpdate.asObservable();
	overlayOpen$ = this.overlayOpen.asObservable();
	closeAllMenus$ = this.closeMenusSource.asObservable();

	theme = computed(() => (this.layoutConfig().darkTheme ? 'light' : 'dark'));
	isSidebarActive = computed(() => this.layoutState().overlayMenuActive || this.layoutState().staticMenuMobileActive);
	isDarkTheme = computed(() => this.layoutConfig().darkTheme);
	getPrimary = computed(() => this.layoutConfig().primary);
	getSurface = computed(() => this.layoutConfig().surface);
	isOverlay = computed(() => this.layoutConfig().menuMode === 'overlay');
	transitionComplete = signal(false);

	private initialized = false;

	constructor() {
		effect(() => {
			if (this.layoutConfig()) this.configUpdate.next(this.layoutConfig());
		});

		effect(() => {
			const config = this.layoutConfig();
			if (!this.initialized || !config) {
				this.initialized = true;
				return;
			}
			this.handleDarkModeTransition(config);
		});

		this.applyThemeFromCode();
	}

	private handleDarkModeTransition(config: layoutConfig) {
		if ((document as any).startViewTransition) {
			(document as any)
				.startViewTransition(() => this.toggleDarkMode(config))
				.ready.then(() => this.onTransitionEnd())
				.catch(() => {});
		} else {
			this.toggleDarkMode(config);
			this.onTransitionEnd();
		}
	}

	toggleDarkMode(config?: layoutConfig) {
		const dark = (config || this.layoutConfig()).darkTheme;
		document.documentElement.classList.toggle('app-dark', !!dark);
	}

	private onTransitionEnd() {
		this.transitionComplete.set(true);
		setTimeout(() => this.transitionComplete.set(false));
	}

	onMenuToggle() {
		if (this.isOverlay()) {
			this.layoutState.update((prev) => ({
				...prev,
				overlayMenuActive: !this.layoutState().overlayMenuActive
			}));
			if (this.layoutState().overlayMenuActive) this.overlayOpen.next();
		}

		if (this.isDesktop()) {
			this.layoutState.update((prev) => ({
				...prev,
				staticMenuDesktopInactive: !this.layoutState().staticMenuDesktopInactive
			}));
		} else {
			this.layoutState.update((prev) => ({
				...prev,
				staticMenuMobileActive: !this.layoutState().staticMenuMobileActive
			}));
			if (this.layoutState().staticMenuMobileActive) this.overlayOpen.next();
		}
	}

	isDesktop() {
		return window.innerWidth > 991;
	}

	onMenuStateChange(event: MenuChangeEvent) {
		this.menuSource.next(event);
	}

	reset() {
		this.resetSource.next();
	}

	closeAllMenus() {
		this.closeMenusSource.next();
	}

	applyThemeFromCode() {
		const preset = (this.layoutConfig().preset as keyof typeof presets) || 'Nora';
		const primary = this.layoutConfig().primary || 'fuchsia';
		const surface = this.layoutConfig().surface || 'zinc';

		this.layoutConfig.set({
			preset,
			primary,
			surface,
			darkTheme: this.layoutConfig().darkTheme ?? false,
			menuMode: this.layoutConfig().menuMode ?? 'static'
		});

		const surfacePalette = this.getSurfacePalette(surface);
		const primaryPalette = this.getPrimaryPalette(preset, primary);
		const presetExt = this.getPresetExt(preset, primary, primaryPalette);

		$t().preset(presets[preset]).preset(presetExt).surfacePalette(surfacePalette).use({ useDefaultOptions: true });
	}

	private getSurfacePalette(surfaceName: string) {
		return this.getSurfaces().find((s) => s.name === surfaceName)?.palette;
	}

	private getPrimaryPalette(preset: keyof typeof presets, color: string) {
		return (presets[preset].primitive as Record<string, any> | undefined)?.[color];
	}

	private getSurfaces() {
		return [
			{
				name: 'zinc',
				palette: {
					0: '#ffffff',
					50: '#fafafa',
					100: '#f4f4f5',
					200: '#e4e4e7',
					300: '#d4d4d8',
					400: '#a1a1aa',
					500: '#71717a',
					600: '#52525b',
					700: '#3f3f46',
					800: '#27272a',
					900: '#18181b',
					950: '#09090b'
				}
			}
		];
	}

	private getPresetExt(preset: keyof typeof presets, colorName: string, colorPalette: any) {
		if (colorName === 'noir') {
			return {
				semantic: {
					primary: {
						50: '{surface.50}',
						100: '{surface.100}',
						200: '{surface.200}',
						300: '{surface.300}',
						400: '{surface.400}',
						500: '{surface.500}',
						600: '{surface.600}',
						700: '{surface.700}',
						800: '{surface.800}',
						900: '{surface.900}',
						950: '{surface.950}'
					},
					colorScheme: {
						light: {
							primary: {
								color: '{primary.950}',
								contrastColor: '#ffffff',
								hoverColor: '{primary.800}',
								activeColor: '{primary.700}'
							},
							highlight: {
								background: '{primary.950}',
								focusBackground: '{primary.700}',
								color: '#ffffff',
								focusColor: '#ffffff'
							}
						},
						dark: {
							primary: {
								color: '{primary.50}',
								contrastColor: '{primary.950}',
								hoverColor: '{primary.200}',
								activeColor: '{primary.300}'
							},
							highlight: {
								background: '{primary.50}',
								focusBackground: '{primary.300}',
								color: '{primary.950}',
								focusColor: '{primary.950}'
							}
						}
					}
				}
			};
		}
		return {
			semantic: {
				primary: colorPalette,
				colorScheme: {
					light: {
						primary: {
							color: '{primary.500}',
							contrastColor: '#ffffff',
							hoverColor: '{primary.600}',
							activeColor: '{primary.700}'
						},
						highlight: {
							background: '{primary.50}',
							focusBackground: '{primary.100}',
							color: '{primary.700}',
							focusColor: '{primary.800}'
						}
					},
					dark: {
						primary: {
							color: '{primary.400}',
							contrastColor: '{surface.900}',
							hoverColor: '{primary.300}',
							activeColor: '{primary.200}'
						},
						highlight: {
							background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
							focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
							color: 'rgba(255,255,255,.87)',
							focusColor: 'rgba(255,255,255,.87)'
						}
					}
				}
			}
		};
	}
}
