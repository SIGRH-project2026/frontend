export interface ResponsiveItems {
	[number: number]: { items: number };
}

export interface CustomOptions {
	loop: boolean;
	mouseDrag: boolean;
	touchDrag: boolean;
	pullDrag: boolean;
	dots: boolean;
	navSpeed: number;
	autoplay: boolean;
	navText: string[];
	responsive: ResponsiveItems;
	nav: boolean;
	margin?: number;
}

export function generateCustomOptions(responsiveItems: ResponsiveItems, dots: boolean = false, margin?: number): CustomOptions {
	return {
		loop: true,
		mouseDrag: false,
		touchDrag: false,
		pullDrag: false,
		dots: dots,
		navSpeed: 700,
		autoplay: true,
		navText: ['<i class="fa fa-arrow-left"></i>', '<i class="fa fa-arrow-right"></i>'],
		responsive: responsiveItems,
		nav: true,
		margin: margin
	};
}

