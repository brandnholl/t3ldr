export default {
	async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
		switch (controller.cron) {
			case '* * * * *':
				try {
					const response = await fetch(
						`https://youtube.googleapis.com/youtube/v3/playlistItems?part=id&part=contentDetails&maxResults=1000&playlistId=UUbRP3c757lWg9M-U7TyEkXA&key=${env.YOUTUBE_API_KEY}`
					);
					const data = await response.json();
					const processedVideos = (data as { items: Array<{ contentDetails: { videoId: string; videoPublishedAt: string } }> }).items.map(
						(item) => ({
							videoId: item.contentDetails.videoId,
							publishedAt: item.contentDetails.videoPublishedAt,
						})
					);
					console.log(JSON.stringify(processedVideos));
				} catch (error) {
					console.error('Error fetching YouTube API:', error);
				}
				break;
		}
	},
	async fetch(request, env, context): Promise<Response> {
		// Specify the gateway label and other options here
		const response = await env.AI.run(
			'@cf/meta/llama-3.3-70b-instruct-fp8-fast',
			{
				prompt:
					'Tell me everything you know about Cloudflare Workers. Write a 10 paragraph essa. Make sure that it is 10 paragraphs long and each paragraph is 100 words long.',
				max_tokens: 1000,
				temperature: 0.5,
				stream: false,
			},
			{
				gateway: {
					id: 't3ldr',
					skipCache: true,
				},
			}
		);

		// Return the AI response as a JSON object
		return new Response(JSON.stringify(response), {
			headers: { 'Content-Type': 'application/json' },
		});
	},
} satisfies ExportedHandler<Env>;
