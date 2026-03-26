import { Request, Response } from 'express';
import { Banner } from '../../models/banner.schema';
import { sendResponse } from '../../utils/sendResponse';
import { getFileUrl } from '../../utils/upload';
import { uploadBannerSchema, updateBannerSchema, reorderSchema } from '../../validators/admin.validator';

export const getBanners = async (_req: Request, res: Response): Promise<void> => {
  try {
    const banners = await Banner.find().sort({ order: 1 });
    sendResponse(res, 200, { banners });
  } catch (err) {
    console.error('[AdminGetBanners Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const createBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      sendResponse(res, 400, { error: 'No image file provided.' });
      return;
    }

    const { error, value } = uploadBannerSchema.validate(req.body);
    if (error) {
      sendResponse(res, 400, { error: error.details[0].message });
      return;
    }

    const imageUrl = getFileUrl(req.file.filename);
    const count = await Banner.countDocuments();

    const banner = await Banner.create({
      imageUrl,
      label: value.label,
      status: 'active',
      order: count + 1,
    });

    sendResponse(res, 201, { banner, message: 'Banner created.' });
  } catch (err) {
    console.error('[AdminCreateBanner Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const updateBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = updateBannerSchema.validate(req.body);
    if (error) {
      sendResponse(res, 400, { error: error.details[0].message });
      return;
    }

    const { bannerId } = req.params;
    const banner = await Banner.findByIdAndUpdate(bannerId, { $set: value }, { new: true });

    if (!banner) {
      sendResponse(res, 404, { error: 'Banner not found.' });
      return;
    }

    sendResponse(res, 200, { banner, message: 'Banner updated.' });
  } catch (err) {
    console.error('[AdminUpdateBanner Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const reorderBanners = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error, value } = reorderSchema.validate(req.body);
    if (error) {
      sendResponse(res, 400, { error: error.details[0].message });
      return;
    }

    const updates = value.order.map((bannerId: string, index: number) =>
      Banner.findByIdAndUpdate(bannerId, { order: index + 1 })
    );
    await Promise.all(updates);

    sendResponse(res, 200, { message: 'Banners reordered.' });
  } catch (err) {
    console.error('[AdminReorderBanners Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};

export const deleteBanner = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bannerId } = req.params;

    const banner = await Banner.findByIdAndDelete(bannerId);
    if (!banner) {
      sendResponse(res, 404, { error: 'Banner not found.' });
      return;
    }

    sendResponse(res, 200, { message: 'Banner deleted.' });
  } catch (err) {
    console.error('[AdminDeleteBanner Error]', err);
    sendResponse(res, 500, { error: 'Internal server error.' });
  }
};
