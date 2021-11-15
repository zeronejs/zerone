import { DocEntry } from './ts-class.ast.document';
import { Project, ts, Node } from 'ts-morph';
import { compact } from '@zeronejs/utils';

enum DtoFormNamesType {
	controller,
	service,
	entity,
}
export function moduleSupplementary(fileUrl: string, docEntry: DocEntry) {
	const project = new Project();
	const sourceProject = project.addSourceFileAtPath(fileUrl);
	const appModule = sourceProject.getClass(`${docEntry.ModuleName}Module`);
	if (!appModule) {
		return false;
	}
	const froms = compact(
		sourceProject.getImportDeclarations().map((it) => it.getStructure().moduleSpecifier)
	);

	const dtoFormNames = [
		{ fromUrl: `./${docEntry.baseFileName}.controller`, type: DtoFormNamesType.controller },
		{ fromUrl: `./${docEntry.baseFileName}.service`, type: DtoFormNamesType.service },
		{
			fromUrl: `./${docEntry.entitiesName}/${docEntry.baseFileName}.entity`,
			type: DtoFormNamesType.entity,
		},
	].filter((it) => !froms.includes(it.fromUrl));
	if (dtoFormNames.length === 0) {
		return false;
	}

	const properties = appModule.getDecorator('Module')?.getArguments()?.[0];
	if (!Node.isObjectLiteralExpression(properties)) {
		return false;
	}
	let isChangeFlags = false;

	for (const dtoFormName of dtoFormNames) {
		switch (dtoFormName.type) {
			case DtoFormNamesType.controller:
				const ctrlName = `${docEntry.BaseName}Controller`;

				sourceProject.addImportDeclaration({
					namedImports: [ctrlName],
					moduleSpecifier: dtoFormName.fromUrl,
				});
				isChangeFlags = true;
				const sourceControllers = properties.getProperty('controllers');
				if (Node.isPropertyAssignment(sourceControllers)) {
					const initializer = sourceControllers.getInitializer();
					if (Node.isArrayLiteralExpression(initializer)) {
						if (!initializer.getElements().find((it) => it.getText() === ctrlName)) {
							initializer.addElement(ctrlName);
						}
					}
				}
				break;
			case DtoFormNamesType.service:
				const serviceName = `${docEntry.BaseName}Service`;
				const sourceProperties = properties.getProperty('providers');
				const sourceExports = properties.getProperty('exports');
				sourceProject.addImportDeclaration({
					namedImports: [serviceName],
					moduleSpecifier: dtoFormName.fromUrl,
				});
				isChangeFlags = true;
				if (Node.isPropertyAssignment(sourceProperties)) {
					const initializer = sourceProperties.getInitializer();
					if (Node.isArrayLiteralExpression(initializer)) {
						if (!initializer.getElements().find((it) => it.getText() === serviceName)) {
							initializer.addElement(serviceName);
						}
					}
				}
				if (Node.isPropertyAssignment(sourceExports)) {
					const initializer = sourceExports.getInitializer();
					if (Node.isArrayLiteralExpression(initializer)) {
						if (!initializer.getElements().find((it) => it.getText() === serviceName)) {
							initializer.addElement(serviceName);
						}
					}
				}

				break;
			case DtoFormNamesType.entity:
				const entityName = `${docEntry.className}`;
				sourceProject.addImportDeclaration({
					namedImports: [entityName],
					moduleSpecifier: dtoFormName.fromUrl,
				});
				isChangeFlags = true;
				const sourceEntities = properties.getProperty('imports');
				if (Node.isPropertyAssignment(sourceEntities)) {
					const initializer = sourceEntities.getInitializer();
					if (Node.isArrayLiteralExpression(initializer)) {
						const typeormModule = initializer.getElements();
						const typeormStrings = ['TypeOrmModule', 'forFeature'];

						const typeormForFeature = typeormModule.find((typeormModuleItem) => {
							const importsIdentifier = typeormModuleItem
								.getDescendantsOfKind(ts.SyntaxKind.Identifier)
								.map((it) => it.getText());
							return typeormStrings.every((it) => importsIdentifier.includes(it));
						});
						if (Node.isCallExpression(typeormForFeature)) {
							const typeormArgs = typeormForFeature.getArguments()[0];
							if (Node.isArrayLiteralExpression(typeormArgs)) {
								if (!typeormArgs.getElements().find((it) => it.getText() === entityName)) {
									typeormArgs.addElement(entityName);
									isChangeFlags = true;
								}
							}
						}
					}
				}

				break;
		}
	}
	if (isChangeFlags) {
		sourceProject.saveSync();
		return true;
	}
	return false;
}
