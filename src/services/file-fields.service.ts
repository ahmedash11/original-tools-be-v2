import {Request} from '@loopback/rest';
import {promises} from 'fs';
/**
 * Get files and fields for the request
 * @param request - Http request
 */
export async function getFilesAndFields(request: Request, folder: string) {
  const uploadedFiles = request.files;
  const mapper = (f: globalThis.Express.Multer.File) => ({
    fieldname: f.fieldname,
    originalname: f.originalname,
    encoding: f.encoding,
    mimetype: f.mimetype,
    size: f.size,
    link: `http://etoolsshop.com/uploads/images/${folder}/${f.filename}`,
  });
  let files: object[] = [];
  if (Array.isArray(uploadedFiles)) {
    const renamePromises: Promise<void>[] = [];
    for (const file of uploadedFiles) {
      renamePromises.push(
        promises.rename(
          file.path,
          `${file.destination}/${folder}/${file.filename}`,
        ),
      );
    }
    await Promise.all(renamePromises);
    files = uploadedFiles.map(mapper);
  } else {
    for (const filename in uploadedFiles) {
      files.push(...uploadedFiles[filename].map(mapper));
    }
  }
  return {files, fields: request.body};
}
