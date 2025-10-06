import QRCode from 'qrcode';
import { prisma } from '../utils/prisma';

export const getUserBadges = (userId: string) =>
  prisma.badge.findMany({
    where: { userId },
    orderBy: { issuedAt: 'desc' },
  });

export const generateBadgeQr = async (badgeId: string, userId: string, baseUrl: string) => {
  const badge = await prisma.badge.findUnique({ where: { id: badgeId } });
  if (!badge || badge.userId !== userId) {
    throw new Error('Бейдж табылмады');
  }
  if (badge.qrCodeUrl) {
    return badge.qrCodeUrl;
  }
  const url = `${baseUrl.replace(/\/$/, '')}/u/${userId}`;
  const dataUrl = await QRCode.toDataURL(url, { width: 300 });
  await prisma.badge.update({ where: { id: badgeId }, data: { qrCodeUrl: dataUrl } });
  return dataUrl;
};
