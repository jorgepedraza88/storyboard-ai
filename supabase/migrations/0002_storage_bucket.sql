-- Public bucket so image_url can be a plain public URL (no signed-URL refresh logic needed)
insert into storage.buckets (id, name, public)
values ('storyboard-images', 'storyboard-images', true)
on conflict (id) do nothing;

create policy "storyboard_images_public_read"
  on storage.objects for select
  using (bucket_id = 'storyboard-images');

create policy "storyboard_images_public_insert"
  on storage.objects for insert
  with check (bucket_id = 'storyboard-images');

create policy "storyboard_images_public_update"
  on storage.objects for update
  using (bucket_id = 'storyboard-images')
  with check (bucket_id = 'storyboard-images');

create policy "storyboard_images_public_delete"
  on storage.objects for delete
  using (bucket_id = 'storyboard-images');
