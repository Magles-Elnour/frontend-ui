import { ArabicRangeLabel } from './app.config';

describe('ArabicRangeLabel', () => {
  it('shows the current page, total pages and the displayed range', () => {
    expect(ArabicRangeLabel(0, 20, 53)).toBe(
      'الصفحة 1 من 3 / عرض 1 - 20 من 53 عنصر',
    );
  });

  it('clamps the range end on the last page', () => {
    expect(ArabicRangeLabel(2, 20, 53)).toBe(
      'الصفحة 3 من 3 / عرض 41 - 53 من 53 عنصر',
    );
  });

  it('handles an empty result set', () => {
    expect(ArabicRangeLabel(0, 20, 0)).toBe('الصفحة 1 من 1 / المجموع: 0 عنصر');
  });
});