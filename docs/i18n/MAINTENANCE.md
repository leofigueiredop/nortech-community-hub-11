# Translation Maintenance Guidelines

This document outlines the standards and best practices for maintaining translation files and adding contextual information to ensure long-term maintainability of the internationalization system.

## Table of Contents
- [Translation File Organization](#translation-file-organization)
- [Adding Context and Comments](#adding-context-and-comments)
- [Review Process](#review-process)
- [Version Control](#version-control)
- [Quality Assurance](#quality-assurance)

## Translation File Organization

### File Structure Maintenance
- Keep translation files organized according to the established namespace structure
- Regularly audit files to ensure they follow the defined patterns
- Remove unused translation keys during regular maintenance
- Keep file sizes manageable (recommended max: 1000 lines per file)

### Key Organization
- Group related translations together within each namespace
- Use consistent indentation (2 spaces) for readability
- Order keys alphabetically within their groups
- Maintain a flat structure where possible to avoid deep nesting

### Example of Well-Organized Translation File:
```json
{
  "// Section: Main navigation items": "",
  "navigation": {
    "home": "Home",
    "profile": "Profile",
    "settings": "Settings"
  },

  "// Section: User actions": "",
  "actions": {
    "delete": "Delete",
    "edit": "Edit",
    "save": "Save"
  }
}
```

## Adding Context and Comments

### JSON Comments
Since JSON doesn't support native comments, use special translation keys prefixed with "// " to add context:

```json
{
  "// NOTE: Only used in the admin dashboard": "",
  "adminControls": {
    "// CONTEXT: Button to approve user submissions": "",
    "approve": "Approve",
    "// CONTEXT: Button to reject user submissions": "",
    "reject": "Reject"
  }
}
```

### Required Context Information
Always include the following information in comments:
1. **Usage Location**: Where the translation is used in the application
2. **Variable Context**: Explanation of any interpolation variables
3. **Special Formatting**: Any specific formatting requirements
4. **Pluralization Rules**: Explanation of plural forms if applicable
5. **Dependencies**: Related translations or components

### Example with Complete Context:
```json
{
  "// LOCATION: User Profile Page": "",
  "// SECTION: Achievement badges": "",
  "achievements": {
    "// CONTEXT: Shown when user earns a badge": "",
    "// VARIABLES: {{badgeName}} - name of the badge, {{date}} - earning date": "",
    "earned": "Earned {{badgeName}} on {{date}}",

    "// CONTEXT: Progress towards next badge": "",
    "// VARIABLES: {{current}} - current points, {{required}} - points needed": "",
    "// FORMAT: Numbers should use thousand separators": "",
    "progress": "{{current}}/{{required}} points"
  }
}
```

## Review Process

### Regular Reviews
1. **Monthly Audits**
   - Check for unused translations
   - Verify context completeness
   - Update outdated comments
   - Validate key naming conventions

2. **Pull Request Reviews**
   - Verify new translations follow guidelines
   - Check context completeness
   - Validate interpolation variables
   - Test translations in context

### Translation Update Checklist
- [ ] Follows naming conventions
- [ ] Includes complete context information
- [ ] Variables are documented
- [ ] Pluralization is handled correctly
- [ ] Special formatting is noted
- [ ] No duplicate keys
- [ ] Keys are in correct namespace
- [ ] Comments are clear and helpful

## Version Control

### Commit Guidelines
- Use descriptive commit messages for translation changes
- Include the affected namespaces in commit messages
- Reference related issues or tickets

Example commit messages:
```
feat(i18n): Add user profile translations
fix(i18n): Correct pluralization in notification messages
chore(i18n): Update comments in auth namespace
```

### Branch Management
- Create separate branches for major translation updates
- Use feature branches for new translation sections
- Regular merges from main to keep translations up to date

## Quality Assurance

### Automated Checks
- Run linting on translation files
- Validate JSON structure
- Check for missing translations
- Verify interpolation variables
- Test pluralization rules

### Manual Review Points
1. **Contextual Accuracy**
   - Translations make sense in context
   - Variables are used correctly
   - Formatting is appropriate

2. **Consistency Check**
   - Terminology is consistent
   - Tone and style match
   - Similar phrases use similar patterns

3. **Technical Validation**
   - No missing or extra variables
   - Correct plural forms
   - Valid JSON structure
   - No duplicate keys

### Quality Metrics
- Percentage of translations with complete context
- Number of translation issues reported
- Time to resolve translation issues
- Coverage of automated tests

## Best Practices

### Do's
✅ Add context for every translation key
✅ Keep related translations grouped together
✅ Use clear, descriptive key names
✅ Document all variables and formatting
✅ Regular audits and cleanup
✅ Maintain consistent style and tone

### Don'ts
❌ Leave translations without context
❌ Create deeply nested structures
❌ Use ambiguous key names
❌ Duplicate translations
❌ Mix different contexts in one group
❌ Leave outdated comments

## Maintenance Schedule

### Daily
- Review new translation additions
- Verify context completeness
- Check for immediate issues

### Weekly
- Run automated validation
- Update documentation if needed
- Review pending translation issues

### Monthly
- Full translation audit
- Remove unused translations
- Update and verify all comments
- Check for consistency issues
- Generate translation reports

### Quarterly
- Major version updates
- Complete review of all namespaces
- Update maintenance documentation
- Review and update best practices

## Tools and Scripts

### Recommended Tools
- JSON linters
- Translation validation scripts
- Key usage analyzers
- Automated testing tools

### Custom Scripts
- Translation completeness checker
- Context validator
- Duplicate key detector
- Unused key finder

## Emergency Maintenance

### Critical Issues
1. **Missing Translations**
   - Immediately add required translations
   - Add proper context after fixing
   - Document the emergency change

2. **Incorrect Translations**
   - Fix incorrect translations
   - Verify in all affected locations
   - Update context to prevent future issues

### Hotfix Process
1. Create hotfix branch
2. Make necessary changes
3. Add/update context
4. Emergency review
5. Deploy changes
6. Document incident

## Additional Resources

### Documentation
- [Translation Structure Guide](./TRANSLATION_STRUCTURE.md)
- [Naming Conventions](./NAMING_CONVENTIONS.md)
- [Interpolation and Context](./INTERPOLATION_AND_CONTEXT.md)

### Templates
- [Common Translations](./templates/common.json)
- [Form Translations](./templates/forms.json)
- [Error Messages](./templates/errors.json)

### Tools
- i18next-parser
- i18next-scanner
- translation-check scripts 