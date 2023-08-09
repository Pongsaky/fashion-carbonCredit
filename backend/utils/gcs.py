import os
import hashlib
from datetime import datetime
from google.cloud import storage

# os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "./backend/cert/carboncredit-391108-464488a6345e.json"
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "/etc/secrets/carboncredit-391108-464488a6345e.json"

class GCStorage:
    def __init__(self):
        self.storage_client = storage.Client()
        self.bucket_name = 'carboncredit'

    def upload_file(self, file):
        bucket = self.storage_client.get_bucket(self.bucket_name)
        # encrypt file name and date time
        date_time = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
        file_name_encode = hashlib.sha256((file.filename.split('.')[0]+date_time).encode()).hexdigest() + '.' + file.filename.split('.')[1]
        file_path = file_name_encode
        blob = bucket.blob(file_path)
        blob.upload_from_file(file.file)
        return f'https://storage.googleapis.com/carboncredit/{file_path}'

    def delete_file(self, blob_name):
        bucket = self.storage_client.get_bucket(self.bucket_name)
        blobs = bucket.list_blobs()
        for blob in blobs:
            print(blob.name)
            if blob.name == blob_name:
                blob.delete()
                return f"Blob {blob_name} deleted."
        return f"Not Found this file {blob_name}"