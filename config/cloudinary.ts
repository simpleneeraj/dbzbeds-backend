// import cloudinary from 'cloudinary';
import cloudinary from 'cloudinary';



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const uploads = (file: any, folder: any) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(file, (result: { url: any; public_id: any; }) => {
            resolve(
                {
                    url: result.url,
                    id: result.public_id,
                },
                // {
                //     resource_type: 'auto'
                //     // folder: folder,
                // },
            );
        });
    });
};

export default uploads;