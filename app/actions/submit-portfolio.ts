'use server';

import { rewriteBio } from '@/lib/gemini';
import { uploadImage } from '@/lib/cloudinary';
import { createServiceClient } from '@/lib/supabase';
import slugify from 'slugify';

export type SubmitResult =
    | { success: true; subdomain: string }
    | { success: false; error: string };

export async function submitPortfolio(
    formData: FormData
): Promise<SubmitResult> {
    try {
        const fullName = formData.get('full_name') as string;
        const email = formData.get('email') as string;
        const profession = formData.get('profession') as string;
        const rawBio = formData.get('raw_bio') as string;
        const profilePhotoFile = formData.get('profile_photo') as File | null;
        const projectFiles = formData.getAll('project_photos') as File[];

        const philosophy = formData.get('philosophy') as string;

        if (!fullName || !email || !profession || !rawBio) {
            return { success: false, error: 'All fields are required.' };
        }

        // Generate subdomain slug
        const subdomain = slugify(fullName, { lower: true, strict: true });

        // Upload profile photo
        let profileImgUrl = '';
        if (profilePhotoFile && profilePhotoFile.size > 0) {
            profileImgUrl = await uploadImage(profilePhotoFile, `portfolio-engine/${subdomain}/profile`);
        }

        // Upload project photos
        const projectsJson: { title: string; img_url: string }[] = [];
        for (let i = 0; i < Math.min(projectFiles.length, 5); i++) {
            const file = projectFiles[i];
            if (file && file.size > 0) {
                const imgUrl = await uploadImage(file, `portfolio-engine/${subdomain}/projects`);
                projectsJson.push({
                    title: `Project ${i + 1}`,
                    img_url: imgUrl,
                });
            }
        }

        // Rewrite bio with Gemini AI
        let polishedBio = '';
        try {
            polishedBio = await rewriteBio(rawBio, profession);
        } catch (err: any) {
            console.error('Gemini AI error:', err);
            return { success: false, error: `AI Polish failed: ${err.message || 'unknown error'}` };
        }

        // Save to Supabase
        const supabase = createServiceClient();
        const { error: dbError } = await supabase
            .from('profiles')
            .upsert(
                {
                    email,
                    full_name: fullName,
                    profession,
                    raw_bio: rawBio,
                    bio: polishedBio,
                    philosophy: philosophy || null,
                    profile_img: profileImgUrl || null,
                    projects_json: projectsJson,
                    subdomain,
                },
                { onConflict: 'email' }
            );

        if (dbError) {
            console.error('Supabase error:', dbError);
            if (dbError.code === '23505') {
                return { success: false, error: 'A portfolio with this name or email already exists.' };
            }
            return { success: false, error: `Database error: ${dbError.message}` };
        }

        return { success: true, subdomain };
    } catch (err: any) {
        console.error('submitPortfolio critical failure:', err);
        return { success: false, error: err.message || 'Something went wrong. Please try again.' };
    }
}
