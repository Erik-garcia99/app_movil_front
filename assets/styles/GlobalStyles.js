
import { StyleSheet } from 'react-native';
import { COLORS } from '../../src/constants/colors';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
    },
    card: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 12,
        padding: 24,
        width: '100%',
        // Sombras para que se vea pro (opcional)
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 14,
        fontSize: 14,
        color: COLORS.black,
        marginBottom: 20,
    },
    mainButton: {
        backgroundColor: COLORS.buttonDark,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    // Aquí está la magia de la tarjeta que agrupa los inputs
    formCard: {
        backgroundColor: '#F3EFE9', // Color cremita del diseño de Figma
        width: '100%',
        borderRadius: 12,
        padding: 24,
        marginBottom: 48, // Espacio grande antes del botón de registrarse
    },
    label: {
        color: '#1A1A1A',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        padding: 14,
        fontSize: 14,
        color: '#000',
        marginBottom: 20,
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },

    topHeader: {
        backgroundColor: '#F5EFEB', 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    branchSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    branchText: {
        fontSize: 12,
        color: '#000',
        marginRight: 5,
        lineHeight: 14,
    },
    statusBadge: {
        backgroundColor: '#4ADE80', 
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#000',
        fontSize: 12,
        fontWeight: '600',
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    
    mainContent: {
        flex: 1, 
    },



});



