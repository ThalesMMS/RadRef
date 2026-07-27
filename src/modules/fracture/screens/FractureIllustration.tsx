import { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '../../../core/i18n';
import { font, radii, spacing, useTheme } from '../../../theme';
import type { FractureIllustrationSource } from '../illustrations';

type FractureIllustrationProps = Readonly<{
  illustration: FractureIllustrationSource;
  selectedCode: string;
}>;

export function FractureIllustration({ illustration, selectedCode }: FractureIllustrationProps) {
  const [expanded, setExpanded] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(0);
  const { t } = useI18n();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { aspectRatio } = illustration;
  const modalWidth = Math.max(width - (spacing.md * 2), 1);
  const previewHeight = Math.min((previewWidth || modalWidth) / aspectRatio, 520);

  return (
    <>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.heading}>
          <View style={styles.headingCopy}>
            <Text style={[styles.title, { color: colors.text }]}>
              {t('fracture.illustration.title')}
            </Text>
            <Text style={[styles.source, { color: colors.textSecondary }]}>
              {t('fracture.illustration.source', { page: illustration.sourcePage })}
            </Text>
          </View>
          <View style={[styles.codeBadge, { backgroundColor: colors.fractureSolid }]}>
            <Text style={styles.code}>{selectedCode}</Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('fracture.illustration.expandAccessibility', {
            page: illustration.sourcePage,
          })}
          onLayout={(event) => setPreviewWidth(event.nativeEvent.layout.width)}
          onPress={() => setExpanded(true)}
          style={({ pressed }) => [styles.imageButton, pressed && styles.pressed]}
        >
          <Image
            source={illustration.image}
            resizeMode="contain"
            style={[styles.preview, { height: previewHeight }]}
          />
          <Text style={[styles.expandHint, { color: colors.fracture }]}>
            {t('fracture.illustration.expand')}
          </Text>
        </Pressable>
      </View>

      <Modal
        animationType="fade"
        onRequestClose={() => setExpanded(false)}
        presentationStyle="fullScreen"
        visible={expanded}
      >
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { paddingTop: insets.top + spacing.sm }]}>
            <View style={styles.headingCopy}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t('fracture.illustration.title')}
              </Text>
              <Text style={[styles.source, { color: colors.textSecondary }]}>
                {t('fracture.illustration.source', { page: illustration.sourcePage })}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => setExpanded(false)}
              hitSlop={8}
              style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
            >
              <Text style={[styles.closeText, { color: colors.fracture }]}>
                {t('fracture.illustration.close')}
              </Text>
            </Pressable>
          </View>
          <ScrollView
            maximumZoomScale={4}
            minimumZoomScale={1}
            contentContainerStyle={[
              styles.modalContent,
              { paddingBottom: insets.bottom + spacing.lg },
            ]}
            centerContent
          >
            <Image
              source={illustration.image}
              resizeMode="contain"
              style={{ width: modalWidth, height: modalWidth / aspectRatio }}
            />
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  heading: {
    minHeight: 60,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headingCopy: {
    flex: 1,
    gap: 1,
  },
  title: {
    ...font.headline,
  },
  modalTitle: {
    ...font.title3,
  },
  source: {
    ...font.footnote,
  },
  codeBadge: {
    minWidth: 48,
    minHeight: 28,
    paddingHorizontal: spacing.xs,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  code: {
    ...font.mono,
    color: '#FFFFFF',
  },
  imageButton: {
    backgroundColor: '#FFFFFF',
  },
  preview: {
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  expandHint: {
    ...font.captionBold,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    backgroundColor: '#FFFFFF',
  },
  pressed: {
    opacity: 0.62,
  },
  modal: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  closeButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingLeft: spacing.sm,
  },
  closeText: {
    ...font.bodyMedium,
  },
  modalContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
});
