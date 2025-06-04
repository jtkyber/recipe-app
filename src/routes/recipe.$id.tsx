import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import axios from 'axios';

export const Route = createFileRoute('/recipe/$id')({
	loader: ({ params }) => fetch_recipe(params.id),
	component: RouteComponent,
});

async function fetch_recipe(id: string) {
	const res = await axios.get('http://localhost:3000/getRecipeInformation?', {
		params: {
			id: 635675,
		},
	});
	const data = res.data;
	return data;
}

function RouteComponent() {
	const recipe = useLoaderData({ from: Route.id });
	console.log(recipe);
	return <div>Hello "/recipe_details"!</div>;
}
