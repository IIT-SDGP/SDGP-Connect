// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import { useState } from 'react';
import axios from 'axios';

const useUploadImageToBlob = () => {
  const [isLoading, setIsLoading] = useState(false);

  const uploadImage = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
  
    
    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        "x-upload-key": process.env.NEXT_PUBLIC_UPLOAD_API_KEY,
      },
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          const progress = Math.round((event.loaded * 100) / event.total);
          onProgress(progress);
        }
      },
    });
  
    return response.data.url;
  };
  
  

  return { uploadImage, isLoading };
};

export default useUploadImageToBlob;
