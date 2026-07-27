import type { PropsWithChildren } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '../core/i18n';
import { font, radii, spacing, useTheme } from '../theme';
import { Icon } from './Icon';

type SheetProps = PropsWithChildren<Readonly<{
  visible: boolean;
  onClose: () => void;
  /** Already-translated title; callers own the lookup because some titles are dynamic. */
  title: string;
  /** Already-translated caption under the title. */
  caption?: string;
}>>;

/**
 * Bottom sheet used for definitions and option pickers, so a row can stay a single
 * line and still reach the full explanation or option list underneath it.
 */
export function Sheet({ visible, onClose, title, caption, children }: SheetProps) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent
      statusBarTranslucent
    >
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          onPress={onClose}
          style={styles.backdrop}
        />
        <View style={[styles.panel, { backgroundColor: colors.card, paddingBottom: insets.bottom }]}>
          <View style={[styles.grabber, { backgroundColor: colors.separator }]} />
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
              {caption ? (
                <Text style={[styles.caption, { color: colors.textSecondary }]}>{caption}</Text>
              ) : null}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
              onPress={onClose}
              hitSlop={10}
              style={({ pressed }) => [
                styles.close,
                { backgroundColor: colors.fill },
                pressed && styles.pressed,
              ]}
            >
              <Icon name="xmark" size={12} color={colors.textSecondary} weight="bold" />
            </Pressable>
          </View>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  panel: {
    maxHeight: '85%',
    borderTopLeftRadius: radii.xl + 8,
    borderTopRightRadius: radii.xl + 8,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: radii.pill,
    marginTop: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  headerCopy: { flex: 1, gap: 3 },
  title: { ...font.title3 },
  caption: { ...font.footnote },
  close: {
    width: 28,
    height: 28,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flexGrow: 0 },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  pressed: { opacity: 0.55 },
});
