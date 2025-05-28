import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://qfgqajimuxqktqprfxnu.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmZ3FhamltdXhxa3RxcHJmeG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4ODI5NTQsImV4cCI6MjA1MDQ1ODk1NH0.7ljT6dWCZfpHPe8J3ELKHt3iJJp_FMsB9OfWu2bfAPA';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugPosts() {
  console.log('🔍 Debugging posts and author data...\n');

  try {
    // Check posts with basic data
    console.log('1. Checking posts table:');
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, content, author_id, community_id')
      .limit(5);

    if (postsError) {
      console.error('Error fetching posts:', postsError);
      return;
    }

    console.log(`Found ${posts?.length || 0} posts`);
    if (posts && posts.length > 0) {
      posts.forEach(post => {
        console.log(`  Post ${post.id}: author_id=${post.author_id}, content="${post.content.substring(0, 30)}..."`);
      });
    }
    console.log('');

    // Check profiles table
    console.log('2. Checking profiles table:');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .limit(5);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return;
    }

    console.log(`Found ${profiles?.length || 0} profiles`);
    if (profiles && profiles.length > 0) {
      profiles.forEach(profile => {
        console.log(`  Profile ${profile.id}: name="${profile.full_name}", avatar="${profile.avatar_url}"`);
      });
    }
    console.log('');

    // Check posts with joined author data (like the app does)
    console.log('3. Checking posts with joined author data:');
    const { data: postsWithAuthors, error: joinError } = await supabase
      .from('posts')
      .select('id, content, author_id, community_id, author:profiles(*)')
      .limit(3);

    if (joinError) {
      console.error('Error fetching posts with authors:', joinError);
      return;
    }

    console.log(`Found ${postsWithAuthors?.length || 0} posts with join`);
    if (postsWithAuthors && postsWithAuthors.length > 0) {
      postsWithAuthors.forEach(post => {
        console.log(`  Post ${post.id}:`);
        console.log(`    author_id: ${post.author_id}`);
        console.log(`    author data: ${JSON.stringify(post.author, null, 2)}`);
        console.log(`    content: "${post.content.substring(0, 30)}..."`);
        console.log('');
      });
    }

    // Check if there are posts without corresponding profiles
    console.log('4. Checking for orphaned posts (posts without matching profiles):');
    if (profiles && profiles.length > 0) {
      const profileIds = profiles.map(p => p.id);
      const { data: orphanedPosts, error: orphanError } = await supabase
        .from('posts')
        .select('id, author_id')
        .not('author_id', 'in', `(${profileIds.map(id => `"${id}"`).join(',')})`);

      if (orphanError) {
        console.error('Error checking orphaned posts:', orphanError);
        return;
      }

      if (orphanedPosts && orphanedPosts.length > 0) {
        console.log(`⚠️  Found ${orphanedPosts.length} orphaned posts (posts without matching profiles):`);
        orphanedPosts.forEach(post => {
          console.log(`  Post ${post.id}: author_id=${post.author_id} (no matching profile)`);
        });
      } else {
        console.log('✅ No orphaned posts found');
      }
    }

  } catch (error) {
    console.error('❌ Error during debug:', error);
  }
}

debugPosts(); 