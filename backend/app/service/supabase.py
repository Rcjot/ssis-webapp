from config import SUPABASE_URL, SUPABASE_KEY
from supabase import create_client, Client
import os
from . import pillow

url  = SUPABASE_URL
key = SUPABASE_KEY
supabase : Client = create_client(url, key)

def upload_image(image_file, uuid) :
    # file_name = image_file.filename
    student_uuid = uuid
    # ext = os.path.splitext(file_name)[1]
    # print(f"public/{student_uuid}{ext}")
    converted_file = pillow.convert_png(image_file)
    response = (
        supabase.storage
        .from_("avatar_bucket")
        .upload(
            file=converted_file,
            path=f"public/{student_uuid}.png",
            file_options={
                "cache-control" : "10",
                "upsert" : "true",
                "content-type" :"image/png" 
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


def delete_image(image_path) :
    supabase.storage.from_("avatar_bucket").remove([image_path])
