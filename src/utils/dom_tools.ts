export function get_parent_with_class_name(el: HTMLElement, className: string): HTMLElement | null {
	const parent = el.parentElement;
	// console.log(className);
	if (!parent) return null;
	else if (parent.classList.contains(className)) return parent;
	else return get_parent_with_class_name(parent, className);
}
