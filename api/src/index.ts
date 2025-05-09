// /**
//  * Welcome to Cloudflare Workers!
//  *
//  * This is a template for a Scheduled Worker: a Worker that can run on a
//  * configurable interval:
//  * https://developers.cloudflare.com/workers/platform/triggers/cron-triggers/
//  *
//  * - Run `npm run dev` in your terminal to start a development server
//  * - Run `curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"` to see your Worker in action
//  * - Run `npm run deploy` to publish your Worker
//  *
//  * Bind resources to your Worker in `wrangler.jsonc`. After adding bindings, a type definition for the
//  * `Env` object can be regenerated with `npm run cf-typegen`.
//  *
//  * Learn more at https://developers.cloudflare.com/workers/
//  */

// export default {
// 	async fetch(req) {
// 		const url = new URL(req.url);
// 		url.pathname = '/__scheduled';
// 		url.searchParams.append('cron', '* * * * *');
// 		return new Response(`To test the scheduled handler, ensure you have used the "--test-scheduled" then try running "curl ${url.href}".`);
// 	},

// 	// The scheduled handler is invoked at the interval set in our wrangler.jsonc's
// 	// [[triggers]] configuration.
// 	async scheduled(event, env, ctx): Promise<void> {
// 		// A Cron Trigger can make requests to other endpoints on the Internet,
// 		// publish to a Queue, query a D1 Database, and much more.
// 		//
// 		// We'll keep it simple and make an API call to a Cloudflare API:
// 		let resp = await fetch('https://api.cloudflare.com/client/v4/ips');
// 		let wasSuccessful = resp.ok ? 'success' : 'fail';

// 		// You could store this result in KV, write to a D1 Database, or publish to a Queue.
// 		// In this template, we'll just log the result:
// 		console.log(`trigger fired at ${event.cron}: ${wasSuccessful}`);
// 	},
// } satisfies ExportedHandler<Env>;
  
  export default {
	async fetch(request, env): Promise<Response> {
	  // Specify the gateway label and other options here
	  const response = await env.AI.run(
		"@cf/meta/llama-3.3-70b-instruct-fp8-fast",
		{
		  prompt: "Tell me everything you know about Cloudflare Workers. Write a 10 paragraph essa. Make sure that it is 10 paragraphs long and each paragraph is 100 words long.",
		  max_tokens: 1000,
		  temperature: 0.5,
		  stream: false,
		},
		{
		  gateway: {
			id: "t3ldr",
			skipCache: true, 
		  },
		},
	  );
  
	  // Return the AI response as a JSON object
	  return new Response(JSON.stringify(response), {
		headers: { "Content-Type": "application/json" },
	  });
	},
  } satisfies ExportedHandler<Env>;