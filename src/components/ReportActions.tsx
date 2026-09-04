import * as Clipboard from 'expo-clipboard';
import { useEffect, useRef, useState } from 'react';
import { Share, StyleSheet, View } from 'react-native';
import { spacing, type ModuleAccentName } from '../theme';
import { Button } from './Button';

type ReportActionsProps = Readonly<{
  reportText: string;
  shareTitle?: string;
  accent?: ModuleAccentName;
  onReset?: () => void;
  disabled?: boolean;
}>;

export function ReportActions({
  reportText,
  shareTitle,
  accent = 'tint',
  onReset,
  disabled = false,
}: ReportActionsProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = async () => {
    if (!reportText) return;
    await Clipboard.setStringAsync(reportText);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleShare = () => {
    if (!reportText) return;
    void Share.share({
      ...(shareTitle ? { title: shareTitle } : {}),
      message: reportText,
    }).catch(() => undefined);
  };

  return (
    <View style={styles.container}>
      <View style={styles.actionRow}>
        <View style={styles.flexButton}>
          <Button
            labelKey={copied ? 'common.copied' : 'common.copyReport'}
            onPress={handleCopy}
            variant="filled"
            accent={accent}
            icon={copied ? 'checkmark.circle.fill' : 'doc.on.doc'}
            disabled={disabled}
          />
        </View>
        <View style={styles.flexButton}>
          <Button
            labelKey="common.share"
            onPress={handleShare}
            variant="tinted"
            accent={accent}
            icon="square.and.arrow.up"
            disabled={disabled}
          />
        </View>
      </View>
      {onReset ? (
        <Button
          labelKey="common.resetForm"
          onPress={onReset}
          variant="plain"
          accent={accent}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  flexButton: {
    flex: 1,
  },
});
