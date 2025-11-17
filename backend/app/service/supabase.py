from config import SUPABASE_URL, SUPABASE_KEY
from supabase import create_client, Client
import os

url  = SUPABASE_URL
key = SUPABASE_KEY
supabase : Client = create_client(url, key)

def upload_image(image_file, uuid) :
    file_name = image_file.filename
    student_uuid = uuid
    ext = os.path.splitext(file_name)[1]
    print(f"public/{student_uuid}{ext}")
    response = (
        supabase.storage
        .from_("avatar_bucket")
        .upload(
            file=image_file.read(),
            path=f"public/{student_uuid}{ext}",
            file_options={
                "cache-control" : "3600",
                "upsert" : "true",
                "content-type" : image_file.mimetype
            }
        ) 
    )   
    print(response)
    return response.path

def get_public_url(image_path) :
    response = (
        supabase.storage
        .from_("avatar_bucket")
        .get_public_url((image_path))
    )
    return response
